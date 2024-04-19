import torch.nn.functional as F
from sentence_transformers import SentenceTransformer
from pycozo.client import Client
import psycopg2
import os
import sys

def main(dev: bool):
    pg_conn = os.environ['PG_CONN'] # PG_CONN=postgresql://username:password@localhost:5432/dbname
    username = pg_conn.split(':')[1].split('//')[1]
    password = pg_conn.split(':')[2].split('@')[0]
    host = pg_conn.split('@')[1].split(':')[0]
    port = pg_conn.split(':')[3].split('/')[0]
    dbname = pg_conn.split('/')[3]


    # Connect to the database
    conn = psycopg2.connect(dbname=dbname, user=username, password=password, host=host, port=port)
    cur = conn.cursor()

    cur.execute(f"SELECT * FROM {'dev_jokes' if dev else 'jokes'} WHERE approved = TRUE")

    jokes = cur.fetchall()

    model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)

    cozo = Client("sqlite", "cozo.db")

    try:
        cozo.run(":create jokes {k: String => v: <F32; 768>}")
        cozo.run("""::hnsw create jokes:index_name {
                        dim: 768,
                        m: 50,
                        dtype: F32,
                        fields: [v],
                        distance: IP,
                        ef_construction: 20,
                        extend_candidates: false,
                        keep_pruned_connections: false,
                    }
                """)
    except:
        pass
    for joke in jokes:
        joke_id = joke[0]
        joke_text = "search_document: " + joke[1]
        joke_embed = model.encode(joke_text, convert_to_tensor=True)
        # print(f"?[k, v] <- [\"{str(joke_id)}\", {str(joke_embed.tolist())}] \n :put jokes {{k => v}}")
        cozo.run(f"?[k, v] <- [[\"{str(joke_id)}\", {str(joke_embed.tolist())}]] \n :put jokes {{k => v}}")


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: python embedApprovedJokes.py dev/prod')
        sys.exit(1)
    dev = sys.argv[1] == 'dev'
    main(dev)