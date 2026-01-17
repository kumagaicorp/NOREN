import logging
import sys

from .config import settings


def setup_logging() -> logging.Logger:
    logger = logging.getLogger(settings.app_name)
    logger.setLevel(logging.DEBUG if settings.debug else logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    )
    logger.addHandler(handler)

    return logger


logger = setup_logging()
