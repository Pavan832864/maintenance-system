#!/bin/bash
set -e

echo "[v0] Pre-installation setup for EC2 deployment..."

# Update system packages (for Amazon Linux 2)
sudo yum update -y
sudo yum install -y python3 python3-pip git gcc python3-devel

# Create application directory
sudo mkdir -p /home/ec2-user/maintenance-system
sudo chown -R ec2-user:ec2-user /home/ec2-user/maintenance-system

echo "[v0] Pre-installation completed successfully"
