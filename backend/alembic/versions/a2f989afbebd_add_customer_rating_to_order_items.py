"""add_customer_rating_to_order_items

Revision ID: a2f989afbebd
Revises: 282ff3b52d1d
Create Date: 2025-07-30 18:47:46.338979

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a2f989afbebd'
down_revision = '282ff3b52d1d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Añadir columna customer_rating a la tabla order_items
    op.add_column('order_items', sa.Column('customer_rating', sa.Integer(), nullable=True))


def downgrade() -> None:
    # Eliminar columna customer_rating de la tabla order_items
    op.drop_column('order_items', 'customer_rating') 