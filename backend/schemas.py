from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Keep the limits in sync with src/lib/contact.ts.
class ContactIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=200)
    subject: str = Field(default="", max_length=150)
    message: str = Field(min_length=10, max_length=5000)
    # Honeypot: the field is hidden in the form, so only bots fill it in.
    website: str = Field(default="", max_length=200)


class ContactOut(BaseModel):
    ok: bool = True
