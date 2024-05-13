import { Button, Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { Student } from "../types/student";

const { TextArea } = Input;

interface StudentFormProps {
  mode: string;
  visible: boolean;
  currentStudentId: number | null;
  onCancel: () => void;
  onOk: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  mode,
  visible,
  currentStudentId,
  onOk,
  setVisible,
}) => {
  const [formValues, setFormValues] = useState<Student>({
    name: "",
    age: 1,
    course: "",
  });

  useEffect(() => {
    if (mode === "edit" && currentStudentId) {
      fetchData();
    } else {
      setFormValues({ name: "", age: 1, course: "" });
    }
  }, [visible]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/${currentStudentId}`);
      setFormValues(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onCancel = () => {
    setVisible(false);
    setFormValues({ name: "", age: 1, course: "" });
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/${currentStudentId}`);
      onCancel();
      message.success("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      message.error("Failed to delete student!");
    }
  };

  const handleSubmit = async () => {
    try {
      if (mode === "add") {
        await axios.post("/api/", formValues);
      } else if (mode === "edit" && currentStudentId) {
        await axios.put(`/api/${currentStudentId}`, formValues);
      }
      onOk();
      message.success(
        mode === "add"
          ? "Student added successfully!"
          : "Student updated successfully!"
      );
    } catch (error) {
      console.error(
        mode === "add" ? "Error adding student:" : "Error updating student:",
        error
      );
      message.error(
        mode === "add" ? "Failed to add student!" : "Failed to update student!"
      );
    }
  };

  const handleFormChange = (changedValues: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...changedValues,
    }));
  };

  return (
    <Modal
      title={mode === "edit" ? "Edit Student" : "Add Student"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      footer={[
        mode === "edit" && (
          <Button key="delete" danger onClick={handleDelete}>
            Delete
          </Button>
        ),
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form onValuesChange={handleFormChange}>
        <Form.Item
          label="Name"
          name="name"
          initialValue={formValues.name}
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          initialValue={formValues.age}
          rules={[{ required: true, message: "Please input the age!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Course"
          name="course"
          initialValue={formValues.course}
          rules={[{ required: true, message: "Please input the course!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;
