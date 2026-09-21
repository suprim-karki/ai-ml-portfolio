# Insurance Premium Analysis and Prediction

A machine-learning web application that estimates an individual's annual health-insurance charge from demographic, lifestyle, and regional attributes. The project includes exploratory data analysis (EDA), model comparison and tuning, and an interactive Streamlit interface for generating predictions.

**Project repository:** [github.com/suprim-karki/ai-ml-portfolio](https://github.com/suprim-karki/ai-ml-portfolio/tree/main/machine-learning/projects/insurance-analysis)

## Features

- Interactive Streamlit form for entering insurance-related attributes
- Data exploration, feature engineering, encoding, and imputation
- BMI grouped into interpretable weight categories
- Comparison of Linear Regression, Ridge, K-Nearest Neighbors, Random Forest, and Support Vector Regression models
- Persisted preprocessing-and-model pipeline for reproducible inference
- Clear predicted insurance-charge result

## Project structure

```text
insurance-analysis/
├── app.py                    # Streamlit prediction application
├── insurance.ipynb           # EDA, preprocessing, training, and model export
├── insurance.csv             # Source dataset
├── model_pipeline.pkl        # Tuned preprocessing and Random Forest pipeline
├── columns_insurance.pkl     # Training feature-column order
└── README.md
```

## Dataset and features

The dataset contains 1,338 insurance records. Its target is `charges`, the annual individual medical-insurance cost. The source data includes BMI as a numeric measurement; during preprocessing, it is converted to `bmi_category`, and the original `bmi` column is removed before model training.

| Feature | Description |
| --- | --- |
| `age` | Age in years |
| `sex` | Sex recorded in the dataset (`male` or `female`) |
| `bmi` | Body mass index in kg/m²; used to derive `bmi_category` |
| `children` | Number of dependent children covered by insurance |
| `smoker` | Smoking status (`yes` or `no`) |
| `region` | Residential region in the United States |
| `bmi_category` | Derived BMI group: `Underweight`, `Normal`, `Overweight`, or `Obese` |
| `charges` | Annual medical-insurance charge (prediction target) |

BMI categories are derived using these intervals: under 18.5, 18.5–25.9, 26.0–29.9, and 30 or above. Numeric features (`age` and `children`) are imputed; categorical features are imputed and one-hot encoded. These transformations and the selected model are stored together in the exported pipeline.

