from fastapi import FastAPI
import pandas as pd
from pydantic import BaseModel, Field
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"]
)

COLUMNS = ["latitude", "longitude", "price", "minimum_nights","number_of_reviews", "reviews_per_month","calculated_host_listings_count", "availability_365","neighbourhood_group", "neighbourhood"]

# Load the model
model = joblib.load("model_pipeline.pkl")

# Pydantic Model for Input Validation
class Features(BaseModel):
    latitude: float = Field(...,ge=-90, le=90, description="Latitude (-90 to 90)")
    longitude: float = Field(...,ge=-180, le=180, description="Longitude (-180 to 180)")
    price: float = Field(..., gt=0, description="Price per night (>0)")
    minimum_nights : int = Field(...,gt=0,description="Minimum nights required for booking")
    number_of_reviews: int = Field(..., ge=0, description="Total number of reviews")
    reviews_per_month: float = Field(...,ge=0, description="Average reviews per month")
    calculated_host_listings_count: int = Field(...,ge=0,description="Number of listings by this host")
    availability_365: int = Field(..., ge=0, le=365, description="Days available out of 365")
    neighbourhood_group: str = Field(..., min_length=1, description="Neighbourhood Group")
    neighbourhood: str = Field(...,min_length=1, description="Specific neighbourhood name")

@app.get("/")
def greet():
    return "Running"


@app.post("/predict")
def predict(features: Features):
    row = pd.DataFrame([features.model_dump()], columns=COLUMNS)
    prediction = model.predict(row)
    probability = model.predict_proba(row)

    return {
        "Predicted_room_type":prediction[0],
        "Probability": probability.tolist()
        }