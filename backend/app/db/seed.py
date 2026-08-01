from __future__ import annotations
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.book import Category, Author, Book, BookCopy
from app.core.security import get_password_hash

def seed_database(db: Session):
    admin_email = "admin@library.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    
    if not existing_admin:
        admin = User(
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            full_name="System Administrator",
            role=UserRole.ADMIN.value
        )
        db.add(admin)
        db.commit()
        print("Admin user created.")

    if db.query(Category).count() == 0:
        categories = ["Fiction", "Non-Fiction", "Science", "Technology", "History", "Philosophy"]
        cat_objs = []
        for name in categories:
            cat = Category(name=name, description=f"{name} books")
            db.add(cat)
            cat_objs.append(cat)
        db.commit()
        for cat in cat_objs:
            db.refresh(cat)
        
        authors = [
            Author(name="J.K. Rowling"), Author(name="George Orwell"),
            Author(name="Isaac Asimov"), Author(name="Carl Sagan"),
            Author(name="Yuval Noah Harari"), Author(name="J.R.R. Tolkien")
        ]
        for a in authors:
            db.add(a)
        db.commit()
        for a in authors:
            db.refresh(a)

        books = [
            Book(isbn="9780747532699", title="Harry Potter and the Sorcerer's Stone", category_id=cat_objs[0].id),
            Book(isbn="9780451524935", title="1984", category_id=cat_objs[0].id),
            Book(isbn="9780553293357", title="Foundation", category_id=cat_objs[2].id),
            Book(isbn="9780345391803", title="The Demon-Haunted World", category_id=cat_objs[2].id),
            Book(isbn="9780062316097", title="Sapiens", category_id=cat_objs[4].id)
        ]
        for idx, b in enumerate(books):
            b.authors.append(authors[idx % len(authors)])
            db.add(b)
        db.commit()
        
        for b in books:
            db.refresh(b)
            for i in range(2):
                copy = BookCopy(
                    book_id=b.id,
                    barcode=f"BC-{b.isbn}-{i}",
                    condition="Good",
                    is_available=True
                )
                db.add(copy)
        db.commit()
        print("Database seeded with sample data.")
