import React, { useEffect, useState } from 'react';
import { viewTeacher } from '../../AxiosTest/userRoutes';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import Bio from '../../Main/Profile/Bio/Bio';
import TeacherInfo from '../../Main/Profile/TeacherInfo/TeacherInfo';
import Contact from '../../Main/Profile/Contact/Contact';
import Upcoming from '../../Main/Profile/Upcoming/Upcoming';

const ViewTeacher = props => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (props.location.state !== null) {
      const teacher = props.location.state;
      setTeacher(teacher);
      return undefined;
    }

    const getTeacher = async () => {
      const id = props.id;
      try {
        const response = await viewTeacher(id);
        setTeacher(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTeacher();
  }, [props]);

  const teacherProfile = () => {
    return (
      <div className="user-profile-wrapper">
        <div className="panel-left">
          <Bio user={teacher} />
          <div className="sub-cards">
            <TeacherInfo user={teacher} />
            <Contact user={teacher} />
          </div>
        </div>
        <Upcoming user={teacher} />
      </div>
    );
  };

  return <div>{teacher ? teacherProfile() : <LoadingSpinner />}</div>;
};

export default ViewTeacher;
