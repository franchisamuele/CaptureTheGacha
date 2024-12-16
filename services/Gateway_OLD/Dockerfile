FROM python:3.12-slim

WORKDIR /app

COPY ./services/Gateway/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Useless, just to avoid errors
COPY ./services/Player/connection.py connection.py

# Copy the models
COPY ./services/Player/model.py player_model.py
COPY ./services/Auth/model.py auth_model.py
COPY ./services/Auction/model.py auction_model.py

COPY ./services/Gateway/*.py .

EXPOSE 5000

CMD python app.py