import React, { useState, useEffect } from 'react';
import { viewTeachers } from '../../components/AxiosTest/userRoutes';

export const TeacherListContext = React.createContext();
export const TeacherListContextProvider = ({ children }) => {
  const [teacherList, setTeacherList] = useState([]);

  useEffect(() => {
    const getTeachers = async () => {
      if (teacherList.length === 0) {
        try {
          const response = await viewTeachers();
          setTeacherList(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getTeachers();
  }, [teacherList]);

  const teacherListState = {
    teacherList,
    setTeacherList,
  };

  return (
    <TeacherListContext.Provider value={teacherListState}>
      {children}
    </TeacherListContext.Provider>
  );
};
