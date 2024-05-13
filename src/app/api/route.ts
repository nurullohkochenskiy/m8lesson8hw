import { NextRequest } from "next/server";
import { students } from "./data";

export function GET() {
  return Response.json(students);
}

export async function POST(request: NextRequest) {
  const rawStudent = await request.json();
  const newStudent = {
    ...rawStudent,
    id: students[students.length - 1]?.id + 1 || 1,
  };
  students.push(newStudent);
  return Response.json(newStudent, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const editedStudent = await request.json();
  const id = editedStudent.id;

  const index = students.findIndex((student) => student.id === id);

  if (index !== -1) {
    students[index] = editedStudent;

    return Response.json(editedStudent, { status: 200 });
  } else {
    return Response.json({ message: "Student not found" }, { status: 404 });
  }
}
