"""add_rating_count_to_products

Revision ID: 20230720_add_rating_count
Revises: ffdc869c0290
Create Date: 2025-07-20 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20230720_add_rating_count'
down_revision = '4868126f3dd0'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('products', sa.Column('rating_count', sa.Integer(), nullable=False, server_default='0'))

def downgrade() -> None:
    op.drop_column('products', 'rating_count') 