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

## Getting started

### Prerequisites

- Python 3.9 or later
- `pip`

### Installation

From this project directory, create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the required packages:

```bash
pip install streamlit pandas scikit-learn joblib jupyter seaborn matplotlib
```

### Run the application

Use either of the following commands:

```bash
streamlit run app.py
```

```bash
python3 -m streamlit run app.py
```

If `streamlit run app.py` is not recognized on your system, use `python3 -m streamlit run app.py`.

Streamlit will print a local URL, usually `http://localhost:8501`. Open it in a browser, enter the requested information, and select **Predict**.

## Training workflow

The complete workflow is documented in [`insurance.ipynb`](insurance.ipynb):

1. Load and inspect `insurance.csv`.
2. Explore feature distributions, relationships, and numeric correlations.
3. Create BMI categories and remove the original numeric BMI feature.
4. Split the data into training and test sets.
5. Impute numeric and categorical values, then one-hot encode categorical features.
6. Compare five regression models with cross-validated R² and RMSE scores.
7. Tune the Random Forest regressor with `RandomizedSearchCV`.
8. Evaluate the best pipeline on the test split and export it with Joblib.

## Model performance

The following cross-validation results were recorded in the training notebook. The deployed model is a Random Forest regressor selected before hyperparameter tuning.

| Model | Mean R² | Mean RMSE |
| --- | ---: | ---: |
| Linear Regression | 0.738 | 6,124.77 |
| Ridge | 0.739 | 6,123.75 |
| K-Nearest Neighbors | 0.748 | 5,997.73 |
| Random Forest (selected) | **0.816** | **5,133.06** |
| Support Vector Regression | -0.098 | 12,578.66 |

After `RandomizedSearchCV`, the deployed pipeline uses a Random Forest regressor with `n_estimators=300`, `max_depth=5`, `min_samples_split=5`, and `random_state=42`. On the held-out 20% test split, it recorded:

| Metric | Score |
| --- | ---: |
| R² | 0.872 |
| Mean absolute error (MAE) | 2,561.940 |
| Mean squared error (MSE) | 19,940,864.472 |
| Root mean squared error (RMSE) | 4,465.520 |

To retrain the model, open the notebook from this directory and run all cells:

```bash
jupyter notebook insurance.ipynb
```

The exported `.pkl` files must remain alongside `app.py`, because the application loads them at startup.

## Tech stack

- Python
- Streamlit
- pandas
- scikit-learn
- Joblib
- Jupyter Notebook
- Matplotlib and Seaborn

## Limitations and responsible use

- The prediction is an estimate based on the training dataset, not an insurance quote or coverage decision.
- Actual premiums can depend on additional factors not represented in this dataset, including insurer rules, location, plan design, and applicable regulations.
- Model performance can vary with data quality, population differences, and model-training choices.
- The model should be evaluated for fairness and legal compliance before being used in a real insurance workflow.

## License

No license has been specified for this project.
