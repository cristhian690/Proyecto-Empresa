"""migracion inicial limpia

Revision ID: 001_initial
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision:      str                             = "001_initial"
down_revision: Union[str, None]                = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on:    Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # ── 1. PRODUCTOS ──────────────────────────────────────────────────────────
    op.create_table(
        "productos",
        sa.Column("id",          sa.Integer(),   nullable=False),
        sa.Column("codigo",      sa.String(20),  nullable=False),
        sa.Column("descripcion", sa.String(255), nullable=True),
        sa.Column("creado_en",   sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_productos_id",     "productos", ["id"])
    op.create_index("ix_productos_codigo", "productos", ["codigo"], unique=True)

    # ── 2. SALDOS INICIALES ───────────────────────────────────────────────────
    op.create_table(
        "saldos_iniciales",
        sa.Column("id",             sa.Integer(),      nullable=False),
        sa.Column("producto_id",    sa.Integer(),      nullable=False),
        sa.Column("fecha",          sa.Date(),         nullable=False),
        sa.Column("cantidad",       sa.Numeric(18, 6), nullable=False),
        sa.Column("costo_unitario", sa.Numeric(18, 6), nullable=False),
        sa.Column("costo_total",    sa.Numeric(18, 6), nullable=False),
        sa.Column("creado_en",      sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("cantidad >= 0",       name="ck_saldo_cantidad"),
        sa.CheckConstraint("costo_unitario >= 0", name="ck_saldo_costo_unitario"),
        sa.CheckConstraint("costo_total >= 0",    name="ck_saldo_costo_total"),
        sa.ForeignKeyConstraint(["producto_id"], ["productos.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("producto_id", name="unique_saldo_producto"),
    )
    op.create_index("ix_saldos_iniciales_id", "saldos_iniciales", ["id"])

    # ── 3. PROCESAMIENTOS ─────────────────────────────────────────────────────
    op.create_table(
        "procesamientos",
        sa.Column("id",                   sa.Integer(),   nullable=False),
        sa.Column("nombre_archivo",       sa.String(255), nullable=False),
        sa.Column("total_registros",      sa.Integer(),   nullable=True),
        sa.Column("productos_procesados", sa.Integer(),   nullable=True),
        sa.Column("estado",               sa.String(20),  nullable=False),
        sa.Column("alertas",              postgresql.JSONB(), nullable=True),
        sa.Column("creado_en",            sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_procesamientos_id",       "procesamientos", ["id"])
    op.create_index("ix_procesamientos_estado",   "procesamientos", ["estado"])
    op.create_index("ix_procesamientos_creado_en","procesamientos", ["creado_en"])

    # ── 4. MOVIMIENTOS ────────────────────────────────────────────────────────
    op.create_table(
        "movimientos",
        sa.Column("id",               sa.Integer(),      nullable=False),
        sa.Column("producto_id",      sa.Integer(),      nullable=False),
        sa.Column("procesamiento_id", sa.Integer(),      nullable=False),
        sa.Column("fecha",            sa.Date(),         nullable=False),
        sa.Column("tipo_comprobante", sa.SmallInteger(), nullable=False),
        sa.Column("serie",            sa.String(10),     nullable=False),
        sa.Column("numero",           sa.String(20),     nullable=False),
        sa.Column("tipo_operacion",   sa.String(50),     nullable=False),
        # Entradas
        sa.Column("ent_cantidad",     sa.Numeric(18, 6), nullable=True),
        sa.Column("ent_costo_unit",   sa.Numeric(18, 6), nullable=True),
        sa.Column("ent_costo_total",  sa.Numeric(18, 6), nullable=True),
        # Salidas
        sa.Column("sal_cantidad",     sa.Numeric(18, 6), nullable=True),
        sa.Column("sal_costo_unit",   sa.Numeric(18, 6), nullable=True),
        sa.Column("sal_costo_total",  sa.Numeric(18, 6), nullable=True),
        # Saldo calculado
        sa.Column("saldo_cantidad",    sa.Numeric(18, 6), nullable=True),
        sa.Column("saldo_costo_unit",  sa.Numeric(18, 6), nullable=True),
        sa.Column("saldo_costo_total", sa.Numeric(18, 6), nullable=True),
        # Valores originales del Excel (auditoría)
        sa.Column("orig_ent_costo_unit",  sa.Numeric(18, 6), nullable=True),
        sa.Column("orig_ent_costo_total", sa.Numeric(18, 6), nullable=True),
        sa.Column("orig_sal_costo_unit",  sa.Numeric(18, 6), nullable=True),
        sa.Column("orig_sal_costo_total", sa.Numeric(18, 6), nullable=True),
        # Flags de validación — semáforo se calcula en runtime
        sa.Column("saldo_negativo", sa.Boolean(), nullable=True, default=False),
        sa.Column("error_a",        sa.Boolean(), nullable=True, default=False),
        sa.Column("error_b",        sa.Boolean(), nullable=True, default=False),
        sa.Column("creado_en",      sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["producto_id"],      ["productos.id"]),
        sa.ForeignKeyConstraint(["procesamiento_id"], ["procesamientos.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "procesamiento_id", "producto_id", "serie", "numero",
            name="unique_movimiento_procesamiento"
        ),
    )
    op.create_index("ix_movimientos_id",               "movimientos", ["id"])
    op.create_index("ix_movimientos_producto_id",      "movimientos", ["producto_id"])
    op.create_index("ix_movimientos_procesamiento_id", "movimientos", ["procesamiento_id"])
    op.create_index("ix_movimientos_fecha",            "movimientos", ["fecha"])
    op.create_index("ix_movimientos_tipo_operacion",   "movimientos", ["tipo_operacion"])
    op.create_index("idx_mov_producto_fecha",          "movimientos", ["producto_id", "fecha"])


def downgrade() -> None:
    op.drop_table("movimientos")
    op.drop_table("procesamientos")
    op.drop_table("saldos_iniciales")
    op.drop_table("productos")