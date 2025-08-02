from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ColorBase(BaseModel):
    name: str
    hex_code: Optional[str] = None
    description: Optional[str] = None

class ColorCreate(ColorBase):
    pass

class ColorUpdate(BaseModel):
    name: Optional[str] = None
    hex_code: Optional[str] = None
    description: Optional[str] = None

class ColorResponse(ColorBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 