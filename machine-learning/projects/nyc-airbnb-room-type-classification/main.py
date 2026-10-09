from fastapi import FastAPI
import pandas as pd

app = FastAPI()

@app.get("/")
def greet():
    return "Running"


def predict(features):
    row = pd.DataFrame(features.dict())