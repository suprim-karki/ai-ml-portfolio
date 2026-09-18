import streamlit as st
import pandas as pd
import joblib

model = joblib.load("model_pipeline.pkl")
excepted_columns = joblib.load("columns_insurance.pkl")

st.title("Insurance Premium Predictor 💵")
st.markdown("Provide the following details.")


