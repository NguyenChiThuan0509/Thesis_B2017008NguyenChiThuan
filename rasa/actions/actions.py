# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

# ---------------------------------------------------CUSTOM ACTION----------------------------------------------------------

from pymongo import MongoClient
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher

class ActionGetExamSchedule(Action):
    def name(self):
        return "action_get_exam_schedule"

    def run(self, dispatcher, tracker, domain):
        # Lấy thông tin tên lớp từ câu hỏi của người dùng (slot)
        class_name = tracker.get_slot('class_name')

        # Kết nối tới MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["chungchicntt"]
        collection = db["exam_schedule"]

        # Tìm kiếm dữ liệu trong MongoDB
        result = collection.find_one({"class_name": class_name})

        # Kiểm tra kết quả và gửi phản hồi tới người dùng
        if result:
            exam_date = result["exam_date"]
            message = f"Lịch thi của lớp {class_name} là vào ngày {exam_date}."
        else:
            message = f"Không tìm thấy thông tin lịch thi cho lớp {class_name}."

        # Đóng kết nối MongoDB
        client.close()

        # Gửi tin nhắn phản hồi tới người dùng
        dispatcher.utter_message(text=message)

        return []
