def convert_to_persian_numbers(value):
    """Convert Latin digits in a value to Persian digits."""
    if value is None:
        return ""

    persian_digits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    text = str(value)
    return ''.join(persian_digits[int(digit)] if digit.isdigit() else digit for digit in text)
