#!/bin/bash
# Install system dependencies
apt-get update && apt-get install -y libcairo2 libcairo2-dev

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt
