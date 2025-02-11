#!/bin/bash
# Install system dependencies
apt-get update && apt-get install -y libcairo2 libcairo2-dev
pip install -r requirements.txt
