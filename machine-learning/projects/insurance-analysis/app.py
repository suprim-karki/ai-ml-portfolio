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

if st.button("Predict"):
    raw_input = {
        "age":age,
        "sex":sex,
        "children":children,
        "smoker":smoker,
        "region":region,
        "bmi_category":bmi_category
    }

    input_df = pd.DataFrame([raw_input])

    for col in excepted_columns:
        if col not in excepted_columns:
            input_df[col] = 0
    
    input_df=input_df[excepted_columns]

    prediction = model.predict(input_df)[0]

    if prediction:
        st.success(f"The predicted charge is {prediction}")
    else:
        st.error("‼️ Error")
    