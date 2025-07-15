from pydantic import BaseModel
from typing import List

class Spot(BaseModel):
    title: str
    x: float
    y: float
    addr1: str
    contenttypeid: int

class Departure(BaseModel):
    city: str
    district: str

class DateRange(BaseModel):
    start: str
    end: str

class ScheduleRequest(BaseModel):
    departure: Departure
    dateRange: DateRange
    transport: str
    persons: str
    spots: List[Spot]

