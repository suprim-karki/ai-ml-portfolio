# NYC Airbnb Room Type Classification

A machine-learning web application that predicts the likely room type of a New York City Airbnb listing from its location, price, minimum stay, review activity, host listing count, and availability. The project includes exploratory data analysis, preprocessing and model tuning in a Jupyter Notebook, a trained Random Forest pipeline, and a browser-based interface connected to a FastAPI backend.

**Project repository:** [github.com/suprim-karki/ai-ml-portfolio](https://github.com/suprim-karki/ai-ml-portfolio/tree/main/machine-learning/projects/nyc-airbnb-room-type-classification)

## Features

- Web form for entering Airbnb listing details
- Prediction of three room types: Entire home/apt, Private room, and Shared room
- Probability estimates displayed as visual bars
- FastAPI endpoint for model inference
- Preprocessing and trained model saved together in a reusable pipeline
- Data exploration, feature engineering, model comparison, and hyperparameter tuning
- API endpoint setting in the frontend for connecting to a locally running backend

## Project structure

```text
nyc-airbnb-room-type-classification/
├── main.py                  # FastAPI application and prediction endpoint
├── nyc_airbnb.ipynb         # EDA, preprocessing, training, evaluation, and export
├── AB_NYC_2019.csv          # NYC Airbnb 2019 dataset
├── model_pipeline.pkl       # Trained preprocessing and Random Forest pipeline
├── requirements.txt         # Python dependencies
├── frontend/
│   ├── index.html           # Web page and prediction form
│   ├── styles.css           # Frontend styling
│   └── app.js               # Form handling and API requests
└── README.md
```

## Dataset and target

The project uses the New York City Airbnb Open Data dataset for 2019, commonly distributed through Kaggle. It contains 48,895 listings across five New York City borough groups. The target column is `room_type`, which has three categories: `Entire home/apt`, `Private room`, and `Shared room`.

The notebook removes identifying or unused columns such as listing IDs, host IDs, names, and the last review date. Extreme values in `price` and `minimum_nights` are capped at the 99th percentile. Missing numeric values are imputed using the median, numeric features are standardized, and categorical features are imputed using the most frequent value and one-hot encoded.

| Feature | Description |
| --- | --- |
| `latitude` | Listing latitude |
| `longitude` | Listing longitude |
| `price` | Price per night in USD |
| `minimum_nights` | Minimum number of nights required |
| `number_of_reviews` | Total number of reviews |
| `reviews_per_month` | Average reviews received per month |
| `calculated_host_listings_count` | Number of listings associated with the host |
| `availability_365` | Number of days available during the year |
| `neighbourhood_group` | Borough group, such as Manhattan or Brooklyn |
| `neighbourhood` | Specific neighbourhood |
| `room_type` | Prediction target |

## Getting started

### Prerequisites

- Python 3.10 or later recommended
- `pip`

### Installation

Open a terminal in this project directory and create a virtual environment:

```bash
python -m venv .venv
```

Activate it on macOS or Linux:

```bash
source .venv/bin/activate
```

On Windows:

```bash
.venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### Run the application

Start the FastAPI server from the project directory:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Open that address in a browser to use the prediction form. The interactive API documentation is available at `http://localhost:8000/docs`.

The frontend is served by the FastAPI application, so a separate frontend development server is not required. If needed, use **API settings** in the web page to change the prediction endpoint.

## Training workflow

The training and analysis process is documented in [`nyc_airbnb.ipynb`](nyc_airbnb.ipynb):

1. Load and inspect the Airbnb dataset.
2. Explore missing values, room-type distribution, feature distributions, correlations, and geographic patterns.
3. Remove unused columns and cap extreme values in price and minimum nights.
4. Split the data into training and test sets, preserving the target-class proportions.
5. Build a preprocessing pipeline for numeric and categorical features.
6. Compare Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting classifiers.
7. Tune a class-balanced Random Forest using `RandomizedSearchCV` and macro F1 score.
8. Evaluate the selected pipeline on the held-out test set and save it as `model_pipeline.pkl`.

To revisit the analysis or retrain the model, open the notebook and run its cells:

```bash
jupyter notebook nyc_airbnb.ipynb
```

The notebook downloads the source dataset through `kagglehub` in its data-loading section. If you retrain the model, ensure the exported `model_pipeline.pkl` is kept in the same directory as `main.py`.

## Models tried and comparison

Four classification algorithms were compared using 3-fold cross-validation on the training data. Accuracy and macro F1 were both measured; macro F1 is especially useful here because the room-type classes are imbalanced.

| Model | Cross-validation accuracy | Cross-validation macro F1 |
| --- | ---: | ---: |
| Logistic Regression | 66.1% | 0.525 |
| Decision Tree | 78.3% | 0.656 |
| Random Forest | 85.3% | 0.716 |
| Gradient Boosting | 85.0% | 0.706 |

**Random Forest was selected for further tuning** because it achieved the strongest cross-validation results overall. A `RandomizedSearchCV` search tested 10 parameter combinations using 3-fold cross-validation and macro F1 as the selection metric. The chosen class-balanced Random Forest pipeline was then evaluated on the held-out test set.

### Final test-set performance

The notebook recorded the following results on the 20% held-out test set:

| Metric | Result |
| --- | ---: |
| Accuracy | 85.9% |
| Macro F1 score | 0.75 |

The final classification report showed an F1 score of 0.88 for entire homes/apartments, 0.85 for private rooms, and 0.53 for shared rooms. Shared-room recall was lower at approximately 0.38, so the model is less reliable at identifying that minority category.

## Tech stack

- Python
- pandas and NumPy
- scikit-learn
- Joblib
- FastAPI
- Uvicorn
- Pydantic
- Jupyter Notebook
- Matplotlib and Seaborn
- HTML, CSS, and JavaScript

## Limitations and responsible use

- Predictions are estimates based on historical 2019 listings and may not reflect current Airbnb listings or market conditions.
- The model can be less accurate for underrepresented room types, particularly shared rooms.
- Location, price, availability, and review patterns do not guarantee a listing's actual room type.
- The project is intended for learning and demonstration, not for making booking, pricing, or business decisions without further validation.
- The frontend includes a simple fallback estimate if the API cannot be reached; results produced by that fallback are not predictions from the trained machine-learning model.

## License

No license has been specified for this project.
