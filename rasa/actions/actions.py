# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# ---------------------------------------------------CUSTOM ACTION----------------------------------------------------------

import mysql.connector
import re
from typing import Any, Dict, List, Text
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from datetime import datetime
from mysql.connector import Error
from rasa.shared.core.domain import Domain
from sqlalchemy import create_engine, text



import mysql.connector

# Hàm kết nối đến cơ sở dữ liệu
def connect_to_database():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='P28LsJyK',
        database='luanvan'
    )

class ActionQueryAddressClass(Action):

    def name(self) -> Text:
        return "action_query_address_class"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Lấy mã lớp từ slot
        course_code = next(tracker.get_latest_entity_values("course_code"), None)

        if not course_code:
            dispatcher.utter_message(text="Xin vui lòng cung cấp mã lớp học để tôi có thể tra cứu địa chỉ.")
            return []

        # Kết nối đến cơ sở dữ liệu
        connection = connect_to_database()
        try:
            with connection.cursor(dictionary=True) as cursor:
                # Truy vấn địa chỉ lớp học dựa trên mã lớp
                query = """
                    SELECT ten_lop_dao_tao, dia_diem 
                    FROM lop_dao_tao 
                    WHERE ten_lop_dao_tao LIKE %s
                """
                cursor.execute(query, (f"%{course_code}%",))
                result = cursor.fetchone()

            if result:
                class_name = result['ten_lop_dao_tao']
                address = result['dia_diem']
                dispatcher.utter_message(text=f"Địa điểm của lớp '{class_name}' là: {address}.")
            else:
                dispatcher.utter_message(text="Xin lỗi, tôi không tìm thấy thông tin địa chỉ cho lớp này.")
        except Error as e:
            dispatcher.utter_message(text="Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu.")
            print(f"Lỗi khi truy vấn cơ sở dữ liệu: {e}")
        finally:
            connection.close()

        return []

class ActionQueryListExamClass(Action):

    def name(self) -> Text:
        return "action_query_list_exam_class"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Domain) -> List[Dict[Text, Any]]:
        # Lấy giá trị từ các entity
        course_name = next(tracker.get_latest_entity_values("course_name"), None)
        date_time = next(tracker.get_latest_entity_values("date_time"), None)

        if not date_time:
            dispatcher.utter_message(text="Vui lòng cung cấp ngày cụ thể để tra cứu.")
            return []

        # Chuyển đổi định dạng ngày tháng sang 'YYYY-MM-DD'
        try:
            date_time = datetime.strptime(date_time, "%d/%m/%Y").strftime("%Y-%m-%d")
        except ValueError:
            dispatcher.utter_message(text="Định dạng ngày không hợp lệ. Vui lòng cung cấp ngày theo định dạng dd/mm/yyyy.")
            return []

        # Kết nối cơ sở dữ liệu và truy vấn
        connection = connect_to_database()
        try:
            with connection.cursor() as cursor:
                query = """
                SELECT lc.ten_lop, lt.ngay_thi, lc.so_phong
                FROM lop_chieu_sinh lc
                JOIN lop_lich_thi llt ON lc.id = llt.lop_id
                JOIN lich_thi lt ON llt.lich_thi_id = lt.id
                WHERE lt.ngay_thi = %s AND lc.ten_lop LIKE %s
                """
                cursor.execute(query, (date_time, f"%{course_name}%" if course_name else "%"))
                results = cursor.fetchall()

            if results:
                response = "Danh sách lớp thi vào ngày {}:\n".format(date_time)
                for row in results:
                    response += "- Lớp {} tại phòng {}\n".format(row["ten_lop"], row["so_phong"])
                dispatcher.utter_message(text=response)
            else:
                dispatcher.utter_message(text="Không tìm thấy lớp nào thi vào ngày {}.".format(date_time))
        except Exception as e:
            dispatcher.utter_message(text="Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu.")
        finally:
            connection.close()

        return []


class ActionDefaultFallback(Action):
    def name(self) -> str:
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get('text', '')
        # Log hoặc lưu lại tin nhắn không hiểu vào cơ sở dữ liệu
        dispatcher.utter_message(text="Xin lỗi, tôi không hiểu ý bạn. Bạn có thể nói rõ hơn không?")
        return []

class ActionFees(Action):

    def name(self) -> Text:
        return "action_fees"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Kết nối đến cơ sở dữ liệu
        connection = connect_to_database()
        try:
            with connection.cursor(dictionary=True) as cursor:
                # Truy vấn tất cả các loại lệ phí thi
                query = "SELECT loai_le_phi, le_phi FROM le_phi_thi"
                cursor.execute(query)
                results = cursor.fetchall()

            if results:
                response = "Các loại lệ phí thi hiện có:\n"
                for row in results:
                    response += f"- {row['loai_le_phi']}: {row['le_phi']} VNĐ\n"
                dispatcher.utter_message(text=response)
            else:
                dispatcher.utter_message(text="Xin lỗi, không tìm thấy thông tin lệ phí thi nào.")
        except Error as e:
            dispatcher.utter_message(text="Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu.")
            print(f"Lỗi khi truy vấn cơ sở dữ liệu: {e}")
        finally:
            connection.close()

        return []

class ActionTuition(Action):

    def name(self) -> Text:
        return "action_tuition"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Lấy tên lớp từ slot
        course_name = tracker.get_slot('course_name')
        course_code = tracker.get_slot('course_code')

        # Kết nối đến cơ sở dữ liệu
        connection = connect_to_database()
        try:
            with connection.cursor(dictionary=True) as cursor:
                query = """
                    SELECT le_phi, le_phi_sinh_vien 
                    FROM hoc_phi 
                    WHERE ten_lop = %s OR ten_lop LIKE %s
                """
                cursor.execute(query, (course_name, f"%{course_code}%"))
                result = cursor.fetchone()

            if result:
                tuition_fee = result['le_phi']
                student_fee = result['le_phi_sinh_vien']
                dispatcher.utter_message(text=f"Học phí của lớp {course_name} là {tuition_fee} VNĐ. Học phí dành cho sinh viên là {student_fee} VNĐ.")
            else:
                dispatcher.utter_message(text="Xin lỗi, tôi không tìm thấy thông tin học phí cho lớp này.")
        except Error as e:
            dispatcher.utter_message(text="Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu.")
            print(f"Lỗi khi truy vấn cơ sở dữ liệu: {e}")
        finally:
            connection.close()

        return []
    
class ActionQuerySchoolSchedule(Action):
    def name(self) -> Text:
        return "action_query_school_schedule"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        course_code = next(tracker.get_latest_entity_values("course_code"), None)

        if not course_code:
            dispatcher.utter_message(text="Tôi không thấy mã lớp học trong câu hỏi của bạn. Bạn có thể cung cấp mã lớp học không?")
            return []

        db = connect_to_database()
        cursor = db.cursor(dictionary=True)

        try:
            query = """
                SELECT ten_lop_dao_tao, khai_giang
                FROM lop_dao_tao
                WHERE ten_lop_dao_tao LIKE %s
            """
            search_pattern = f"%{course_code}%"
            cursor.execute(query, (search_pattern,))

            # Lấy tất cả các kết quả từ truy vấn
            results = cursor.fetchall()
            if results:
                # Lấy kết quả đầu tiên
                result = results[0]
                ten_lop_dao_tao = result["ten_lop_dao_tao"]
                khai_giang = result["khai_giang"]
                dispatcher.utter_message(
                    text=f"Lớp '{ten_lop_dao_tao}' có lịch khai giảng vào ngày {khai_giang}."
                )
            else:
                dispatcher.utter_message(
                    text=f"Tôi không tìm thấy thông tin lịch khai giảng cho lớp có mã '{course_code}'. Bạn kiểm tra lại mã lớp được không?"
                )
        except Error as e:
            dispatcher.utter_message(
                text="Có lỗi xảy ra trong quá trình tra cứu thông tin. Bạn vui lòng thử lại sau."
            )
            print(f"Lỗi khi truy vấn cơ sở dữ liệu: {e}")
        finally:
            # Xóa kết quả còn tồn đọng nếu có
            cursor.fetchall()
            cursor.close()
            db.close()

        return []

class ActionQueryExamClass(Action):
    def name(self) -> Text:
        return "action_query_exam_class"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Lấy giá trị course_code từ entities
        raw_course_code = next(tracker.get_latest_entity_values("course_code"), None)

        if not raw_course_code:
            dispatcher.utter_message(text="Tôi không tìm thấy mã lớp học trong câu hỏi của bạn. Bạn có thể cung cấp mã lớp học không?")
            return []

        # Làm sạch dữ liệu course_code bằng regex
        match = re.search(r"[A-Z]{2}[0-9]{3}", raw_course_code)
        course_code = match.group(0) if match else None

        if not course_code:
            dispatcher.utter_message(text="Mã lớp học không hợp lệ. Vui lòng kiểm tra và cung cấp lại mã lớp.")
            return []

        # Kết nối đến cơ sở dữ liệu
        db = connect_to_database()
        cursor = db.cursor(dictionary=True)

        try:
            # Truy vấn bảng lop_chieu_sinh để kiểm tra course_code
            query_lop_chieu_sinh = """
                SELECT id
                FROM lop_chieu_sinh
                WHERE ten_lop LIKE %s
            """
            cursor.execute(query_lop_chieu_sinh, (f"%{course_code}%",))
            lop_result = cursor.fetchone()

            if not lop_result:
                dispatcher.utter_message(text=f"Tôi không tìm thấy thông tin lịch thi cho lớp có mã '{course_code}'.")
                return []

            lop_id = lop_result["id"]

            # Truy vấn bảng lich_thi qua bảng lop_lich_thi
            query_lich_thi = """
                SELECT lich_thi.ngay_thi, lich_thi.han_dang_ky, lich_thi.yeu_cau, lich_thi.dia_chi_dang_ky
                FROM lop_lich_thi
                JOIN lich_thi ON lop_lich_thi.lich_thi_id = lich_thi.id
                WHERE lop_lich_thi.lop_id = %s
            """
            cursor.execute(query_lich_thi, (lop_id,))
            lich_thi_results = cursor.fetchall()

            if lich_thi_results:
                # Xử lý nhiều kết quả lịch thi nếu có
                response = "\n".join([
                    f"- Ngày thi: {result['ngay_thi']}, Hạn đăng ký: {result['han_dang_ky']}, "
                    f"Yêu cầu: {result['yeu_cau']}, Địa chỉ đăng ký: {result['dia_chi_dang_ky']}"
                    for result in lich_thi_results
                ])
                dispatcher.utter_message(text=f"Lịch thi của lớp {course_code}:\n{response}")
            else:
                dispatcher.utter_message(text=f"Không tìm thấy thông tin lịch thi cho lớp {course_code}.")

        except Error as e:
            dispatcher.utter_message(text="Có lỗi xảy ra trong quá trình truy vấn dữ liệu. Vui lòng thử lại sau.")
            print(f"Lỗi khi truy vấn cơ sở dữ liệu: {e}")
        finally:
            cursor.close()
            db.close()

        return []
