'use client'
import { useEffect, useState } from "react";
import { Button, Input, Space, Table,message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import StudentForm from "./components/StudentForm";
import { Student } from "./types/student";

const Students = () => {
  const [visible, setVisible] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = () => {
    setModalMode("add");
    setVisible(true);
  };

  const handleEdit = (id: number) => {
    setModalMode("edit");
    setCurrentStudentId(id);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/${id}`);
      setStudents(students.filter((student) => student.id !== id));
      message.success("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      message.error("Failed to delete student!");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Students</h1>
        <Input.Search placeholder="Search..." />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Student
        </Button>
      </div>
      <Table
        dataSource={students}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Age",
            dataIndex: "age",
            key: "age",
          },
          {
            title: "Course",
            dataIndex: "course",
            key: "course",
          },
          {
            title: "Action",
            key: "action",
            render: (text: string, record: Student) => (
              <Space size="middle">
                <Button type="primary" onClick={() => handleEdit(record.id)}>
                  Edit
                </Button>
                <Button danger onClick={() => handleDelete(record.id)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        rowKey="id"
      />
      <StudentForm
        mode={modalMode}
        visible={visible}
        currentStudentId={currentStudentId}
        setVisible ={setVisible}
        onOk={() => {
          setVisible(false);
          fetchData();
        }}
      />
    </>
  );
};

export default Students;
