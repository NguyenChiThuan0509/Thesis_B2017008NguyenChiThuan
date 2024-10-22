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
from rasa_sdk.executor import CollectingDispatcher
from datetime import datetime
from mysql.connector import Error

import mysql.connector

def connect_to_database():
    return mysql.connector.connect(
        host='localhost',
        user='root',  
        password='P28LsJyK', 
        database='luanvan' 
    )


class ActionTuition(Action):
    def name(self) -> Text:
        return "action_tuition"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy thông tin từ tracker
        user_message = tracker.latest_message.get('text')

        # Kết nối tới cơ sở dữ liệu
        db = connect_to_database()
        cursor = db.cursor()

        if user_message == "Học và thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu CB)":
            cursor.execute("SELECT hoc_phi FROM hoc_phi WHERE ten_lop = 'Học và thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu CB)'")
            result = cursor.fetchone()
            response = f"Học phí của lớp 'Học và thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu CB)' là {result[0]} VND" if result else "Không tìm thấy thông tin."

        elif user_message == "Học và thi chứng chỉ Ứng dụng CNTT nâng cao (ký hiệu NC)":
            cursor.execute("SELECT hoc_phi FROM hoc_phi WHERE ten_lop = 'Học và thi chứng chỉ Ứng dụng CNTT nâng cao (ký hiệu NC)'")
            result = cursor.fetchone()
            response = f"Học phí của lớp 'Học và thi chứng chỉ Ứng dụng CNTT nâng cao (ký hiệu NC)' là {result[0]} VND" if result else "Không tìm thấy thông tin."

        elif user_message == "Ôn thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu ÔN CB)":
            cursor.execute("SELECT hoc_phi FROM hoc_phi WHERE ten_lop = 'Ôn thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu ÔN CB)'")
            result = cursor.fetchone()
            response = f"Học phí của lớp 'Ôn thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu ÔN CB)' là {result[0]} VND" if result else "Không tìm thấy thông tin."
        
        else:
            response = "Xin lỗi, tôi không nhận diện được yêu cầu của bạn."

        # Đóng kết nối
        cursor.close()
        db.close()

        # Gửi phản hồi về cho người dùng
        dispatcher.utter_message(text=response)
        return []

    
    
# Action xử lý truy xuất lệ phí thi
class ActionFees(Action):
    def name(self) -> Text:
        return "action_fees"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        user_message = tracker.latest_message.get('text')
        
        if user_message == "Học viên ghi danh học hoặc ôn tập các lớp tại trung tâm":
            response = "Không cần đóng thêm lệ phí thi."
        
        elif user_message == "Thí sinh tự do":
            # Kết nối tới cơ sở dữ liệu
            db = connect_to_database()
            cursor = db.cursor()
            cursor.execute("SELECT loai_le_phi, le_phi, FROM le_phi_thi")
            results = cursor.fetchall()
            response = "Lệ phí thi dành cho thí sinh tự do có các loại sau:\n"
            for row in results:
                response += f"{row[0]}: {row[1]} VND\n"
            # Đóng kết nối
            cursor.close()
            db.close()
        else:
            response = "Xin lỗi, tôi không nhận diện được yêu cầu của bạn."

        dispatcher.utter_message(text=response)
        return []


class ActionCountStudents(Action):

    def name(self) -> Text:
        return "action_count_students"

    async def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Lấy giá trị của slot 'class_name'
        class_name = tracker.get_slot("class_name")

        if class_name:
            # Sử dụng regex để tìm tên lớp
            match = re.search(r'\b(cb\d{3})\b', class_name)
            if match:
                class_name = match.group(1)  # Lấy tên lớp từ kết quả tìm kiếm
            else:
                dispatcher.utter_message(text="Xin lỗi, tôi không tìm thấy thông tin về lớp.")
                return []

            # Tạo câu truy vấn để lấy danh sách bảng
            try:
                connection = mysql.connector.connect(
                    host='localhost',
                    user='root',
                    password='P28LsJyK',
                    database='luanvan'
                )
                cursor = connection.cursor()
                
                # Lấy danh sách tất cả các bảng trong cơ sở dữ liệu
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                
                # Tìm bảng tương ứng với tên lớp
                table_name = None
                for (table,) in tables:
                    if f"danh_sach_lop_{class_name}" in table or f"danh_sach_lop_on_{class_name}" in table:
                        table_name = table
                        break
                
                if table_name is None:
                    dispatcher.utter_message(text="Xin lỗi, tôi không tìm thấy bảng nào cho lớp này.")
                    return []

                # Tạo câu truy vấn SQL để lấy số lượng học sinh trong lớp
                query = f"SELECT COUNT(*) FROM {table_name}"
                cursor.execute(query)
                result = cursor.fetchone()

                # Trả về số lượng học sinh
                student_count = result[0]
                dispatcher.utter_message(text=f"Số lượng học sinh trong lớp {class_name} là {student_count}.")
            
            except mysql.connector.Error as err:
                dispatcher.utter_message(text=f"Đã có lỗi xảy ra: {err}")
            
            finally:
                if connection.is_connected():
                    cursor.close()
                    connection.close()

        return []

class ActionAskSchoolSchedule(Action):

    def name(self) -> Text:
        return "action_ask_school_schedule"

    async def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        class_name = tracker.get_slot("class_name")
        if not class_name:
            dispatcher.utter_message(text="Xin lỗi, tôi không biết lớp nào bạn đang hỏi.")
            return []

        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='P28LsJyK',
                database='luanvan'
            )
            cursor = connection.cursor()

            # Truy vấn lịch học
            query = f"SELECT schedule FROM {class_name} WHERE class_name = %s"
            cursor.execute(query, (class_name,))
            result = cursor.fetchone()

            if result:
                dispatcher.utter_message(text=f"Lịch học của lớp {class_name} là: {result[0]}.")
            else:
                dispatcher.utter_message(text="Xin lỗi, không tìm thấy lịch học cho lớp này.")

        except mysql.connector.Error as err:
            dispatcher.utter_message(text=f"Đã có lỗi xảy ra: {err}")
        
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        return []

class ActionAskExamSchedule(Action):

    def name(self) -> Text:
        return "action_ask_exam_schedule"

    async def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        class_name = tracker.get_slot("class_name")
        if not class_name:
            dispatcher.utter_message(text="Xin lỗi, tôi không biết lớp nào bạn đang hỏi.")
            return []

        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='P28LsJyK',
                database='luanvan'
            )
            cursor = connection.cursor()

            # Truy vấn lịch thi
            query = f"SELECT exam_schedule FROM {class_name} WHERE class_name = %s"
            cursor.execute(query, (class_name,))
            result = cursor.fetchone()

            if result:
                dispatcher.utter_message(text=f"Lịch thi của lớp {class_name} là: {result[0]}.")
            else:
                dispatcher.utter_message(text="Xin lỗi, không tìm thấy lịch thi cho lớp này.")

        except mysql.connector.Error as err:
            dispatcher.utter_message(text=f"Đã có lỗi xảy ra: {err}")
        
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        return []

class ActionAskTeacherInfo(Action):

    def name(self) -> Text:
        return "action_ask_teacher_infor"

    async def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        class_name = tracker.get_slot("class_name")
        if not class_name:
            dispatcher.utter_message(text="Xin lỗi, tôi không biết lớp nào bạn đang hỏi.")
            return []

        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='P28LsJyK',
                database='luanvan'
            )
            cursor = connection.cursor()

            # Truy vấn thông tin giáo viên
            query = f"SELECT teacher_name FROM {class_name} WHERE class_name = %s"
            cursor.execute(query, (class_name,))
            result = cursor.fetchone()

            if result:
                dispatcher.utter_message(text=f"Giáo viên dạy lớp {class_name} là: {result[0]}.")
            else:
                dispatcher.utter_message(text="Xin lỗi, không tìm thấy thông tin giáo viên cho lớp này.")

        except mysql.connector.Error as err:
            dispatcher.utter_message(text=f"Đã có lỗi xảy ra: {err}")
        
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        return []

class ActionAskAddressClass(Action):

    def name(self) -> Text:
        return "action_ask_address_class"

    async def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        class_name = tracker.get_slot("class_name")
        if not class_name:
            dispatcher.utter_message(text="Xin lỗi, tôi không biết lớp nào bạn đang hỏi.")
            return []

        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='P28LsJyK',
                database='luanvan'
            )
            cursor = connection.cursor()

            # Truy vấn địa chỉ lớp học
            query = f"SELECT address FROM {class_name} WHERE class_name = %s"
            cursor.execute(query, (class_name,))
            result = cursor.fetchone()

            if result:
                dispatcher.utter_message(text=f"Địa chỉ của lớp {class_name} là: {result[0]}.")
            else:
                dispatcher.utter_message(text="Xin lỗi, không tìm thấy địa chỉ lớp này.")

        except mysql.connector.Error as err:
            dispatcher.utter_message(text=f"Đã có lỗi xảy ra: {err}")
        
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        return []

class ActionChieuSinh(Action):
    def name(self) -> str:
        return "action_chieu_sinh"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict):
        # Kết nối tới cơ sở dữ liệu MySQL
        connection = mysql.connector.connect(
            host="localhost", 
            user="root",  
            password="P28LsJyK", 
            database="luanvan" 
        )

        cursor = connection.cursor()
        query = "SELECT lop, ngay_khai_giang, phong, buoi_hoc FROM chieu_sinh ORDER BY ngay_khai_giang ASC"
        cursor.execute(query)
        result = cursor.fetchall()

        # Tạo danh sách thông tin lớp học
        class_info_list = []
        if result:
            for row in result:
                lop, ngay_khai_giang, phong, buoi_hoc = row
                # Chuyển đổi ngày khai giảng sang định dạng dd/mm/yyyy
                ngay_khai_giang_str = ngay_khai_giang.strftime('%d/%m/%Y')
                # Thêm thông tin lớp vào danh sách
                class_info_list.append(f"Lớp {lop} sắp khai giảng vào ngày {ngay_khai_giang_str}, "
                                       f"được dạy tại phòng {phong} vào các buổi {buoi_hoc}.")
            # Kết hợp các thông tin lớp lại thành một thông điệp
            message = "Các lớp sắp khai giảng là:\n" + "\n".join(class_info_list)
        else:
            message = "Hiện tại không có lớp nào sắp khai giảng."

        # Đóng kết nối cơ sở dữ liệu
        cursor.close()
        connection.close()

        # Trả về phản hồi cho người dùng
        dispatcher.utter_message(text=message)

        return []

class ActionTestScores(Action):
    def name(self) -> str:
        return "action_test_scores"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Kết nối tới cơ sở dữ liệu MySQL
        try:
            connection = mysql.connector.connect(
                host="localhost",
                user="root",
                password="P28LsJyK",
                database="luanvan"
            )

            if connection.is_connected():
                cursor = connection.cursor()

                # Lấy tên lớp và họ tên học viên từ tracker
                class_name = tracker.get_slot('class_name')
                student_name = tracker.get_slot('student_name')

                if not class_name or not student_name:
                    dispatcher.utter_message(text="Vui lòng cung cấp tên lớp và họ tên học viên.")
                    return []

                # Đặt tên bảng dựa trên class_name
                table_name = f"bang_diem_lop_{class_name.lower()}"

                # Truy vấn thông tin điểm thi
                query = f"SELECT ho_va_ten, ngay_sinh, diem_thi FROM {table_name} WHERE ho_va_ten = %s"
                cursor.execute(query, (student_name,))
                result = cursor.fetchone()

                if result:
                    ho_va_ten, ngay_sinh, diem_thi = result
                    # Chuyển đổi ngày sinh sang định dạng dd/mm/yyyy
                    ngay_sinh_str = ngay_sinh.strftime('%d/%m/%Y')
                    # Tạo phản hồi
                    message = (f"Học viên {ho_va_ten} học lớp {class_name}, sinh ngày {ngay_sinh_str} "
                               f"có số điểm là: {diem_thi}.")
                else:
                    message = "Không tìm thấy thông tin điểm thi của bạn."

        except Error as e:
            message = "Đã xảy ra lỗi khi kết nối tới cơ sở dữ liệu. Vui lòng thử lại sau."

        finally:
            # Đóng kết nối cơ sở dữ liệu
            if connection.is_connected():
                cursor.close()
                connection.close()

        # Trả về phản hồi cho người dùng
        dispatcher.utter_message(text=message)

        return []