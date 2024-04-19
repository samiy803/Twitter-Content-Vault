import sys
from sentence_transformers import SentenceTransformer

def main(joke: str):
    # load the model
    embed_model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)

    # embed the job description
    embedding = embed_model.encode(joke, convert_to_tensor=True, device="cpu")

    print(embedding.tolist())

if __name__ == '__main__':
    # read stdin
    input = sys.stdin.read()
    main(input)