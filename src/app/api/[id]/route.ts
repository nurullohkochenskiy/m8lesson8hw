import { NextRequest, NextResponse } from "next/server";
import { students } from "../data";

export function GET(
  request: Request,
  context: {
    params: {
      id: number;
    };
  }
) {
  const id = +context.params.id;
  if (students.find((person) => person.id === id)) {
    const student = students.find((person) => person.id === id);
    return Response.json(student);
  } else {
    return NextResponse.json(
      { message: "Student not found" },
      {
        status: 404,
      }
    );
  }
}

export function DELETE(
  request: Request,
  context: {
    params: {
      id: number;
    };
  }
) {
  const id = +context.params.id;
  const index = students.findIndex((student) => student.id === id);
  if (index !== -1) {
    students.splice(index, 1);
    return NextResponse.json(students);
  } else {
    return NextResponse.json(
      { message: "Student not found" },
      {
        status: 404,
      }
    );
  }
}
// export async function PUT(
//   request: Request,
//   context: {
//     params: {
//       id: number;
//     };
//   }
// ) {
//   const id = +context.params.id;
//   const {student} = await request.json();
//   const newStudents = students.map((c) => (c.id === id ? student : c));
//   return NextResponse.json(newStudents);
// }
