import streamlit as st
import pandas as pd
import joblib

model = joblib.load("model_pipeline.pkl")
excepted_columns = joblib.load("columns_insurance.pkl")

st.title("Insurance Premium Predictor 💵")
st.markdown("Provide the following details.")

age = st.slider("Age", 0, 110, 40)
sex = st.selectbox("Sex", ["M","F"])
children = st.number_input("Number of Childrens", 0,8,0)
smoker = st.selectbox("Smoker",["Y","N"])
region = st.selectbox("Region",["southeast","southwest","northwest","northeast"])
bmi_category = st.selectbox("BMI Category", ["Obese","Overweight","Normal","Underweight"])
