import sys
from sentence_transformers import SentenceTransformer

def main(joke: str):
    # load the model
    # nomic-ai/nomic-embed-text-v1.5 is another possible model
    # avsolatorio/GIST-Embedding-v0 has a slightly smaller memory footprint (smaller ctx len) and is slightly more accurate
    embed_model = SentenceTransformer("avsolatorio/GIST-Embedding-v0", trust_remote_code=True)

    # embed the job description
    embedding = embed_model.encode(joke, convert_to_tensor=True, device="cpu")

    print(embedding.tolist())

if __name__ == '__main__':
    # read stdin
    input = sys.stdin.read()
    main(input)