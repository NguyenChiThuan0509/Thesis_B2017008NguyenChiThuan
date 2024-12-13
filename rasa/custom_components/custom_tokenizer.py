from rasa.nlu.tokenizers.tokenizer import Tokenizer, Token
from rasa.shared.nlu.training_data.message import Message
from typing import Any, List, Text
from underthesea import word_tokenize

class VietnameseTokenizer(Tokenizer):
    """Custom Vietnamese Tokenizer using UnderTheSea."""

    def tokenize(self, message: Message, **kwargs: Any) -> List[Token]:
        text = message.get("text")
        tokens = word_tokenize(text)  # Tách từ sử dụng underthesea
        return self._convert_words_to_tokens(tokens, text)
