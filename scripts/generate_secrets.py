#!/usr/bin/env python3
"""
Helper script to generate secure secrets for the application
"""

import hashlib
import secrets
import sys

def generate_password_hash(password):
    """Generate SHA-256 hash of password"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_secret_key():
    """Generate a secure secret key"""
    return secrets.token_urlsafe(32)

def main():
    print("=" * 50)
    print("Secret Generation Helper")
    print("=" * 50)
    print()
    
    # Generate secret key
    secret_key = generate_secret_key()
    print("1. SECRET_KEY (for Flask sessions):")
    print(f"   {secret_key}")
    print()
    
    # Generate admin password hash
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = input("Enter admin password (or press Enter to skip): ").strip()
    
    if password:
        password_hash = generate_password_hash(password)
        print("2. ADMIN_PASSWORD_HASH:")
        print(f"   {password_hash}")
        print()
        print("3. Add to your .env file:")
        print(f"   SECRET_KEY={secret_key}")
        print(f"   ADMIN_PASSWORD_HASH={password_hash}")
    else:
        print("2. To generate password hash, run:")
        print("   python scripts/generate_secrets.py <your-password>")
        print()
        print("3. Add to your .env file:")
        print(f"   SECRET_KEY={secret_key}")
    
    print()
    print("=" * 50)

if __name__ == "__main__":
    main()

