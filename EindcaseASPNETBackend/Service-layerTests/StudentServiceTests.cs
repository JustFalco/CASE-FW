using Xunit;
using Service_layer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_access_layer.DTOs;
using Data_access_layer.Models;
using Data_access_layer.Repositories;
using Moq;

namespace Service_layer.Tests
{
    public class StudentServiceTests
    {
        private CreateStudentDTO studentDto;
        private StudentService _sut;
        private Mock<IStudentRepository> _studentRepoMock;
        private Mock<ICourseRepository> _courseRepoMock;

        public StudentServiceTests()
        {
            _studentRepoMock = new Mock<IStudentRepository>();
            _courseRepoMock = new Mock<ICourseRepository>();

            _sut = new StudentService(_studentRepoMock.Object, _courseRepoMock.Object);
        }

        [Fact()]
        public void CreateStudentTest_ShouldReturnStudentFromDatabase_GivenExistingName()
        {
            //Arrange
            string firstName = "Falco";
            string lastName = "Wolkorte";

            studentDto = new CreateStudentDTO
            {
                CourseInstanceId = -100,
                FirstName = firstName,
                LastName = lastName
            };

            _studentRepoMock.Setup(x => x.GetStudentByNameAndId(firstName, lastName))
                .Returns(new StudentModel { FirstName = firstName, LastName = lastName });


            //Act
            var result = _sut.CreateStudent(studentDto);

            //Assert
            _studentRepoMock.Verify(x => x.GetStudentByNameAndId(firstName, lastName), Times.Once());
            _studentRepoMock.Verify(x => x.SaveStudentAsync(It.IsAny<StudentModel>()), Times.Never());
        }

        [Fact()]
        public void CreateStudentTest_ShouldCreateAndSaveStudent_GivenNonExistingName()
        {
            //Arrange
            string firstName = "Falco";
            string lastName = "Wolkorte";

            studentDto = new CreateStudentDTO
            {
                CourseInstanceId = -100,
                FirstName = firstName,
                LastName = lastName
            };

            _studentRepoMock.Setup(x => x.GetStudentByNameAndId(firstName, lastName)).Returns(value: null);

            //Act
            var result = _sut.CreateStudent(studentDto);

            //Assert
            _studentRepoMock.Verify(x => x.GetStudentByNameAndId(firstName, lastName), Times.Once());
            _studentRepoMock.Verify(x => x.SaveStudentAsync(It.IsAny<StudentModel>()), Times.Once());
        }

        [Fact()]
        public void CreateStudentTest_ShouldThrowException_GivenAnInvalidCourseInstanceId()
        {
            //Arrange
            string firstName = "Falco";
            string lastName = "Wolkorte";
            int courseInstanceId = -100;

            studentDto = new CreateStudentDTO
            {
                CourseInstanceId = courseInstanceId,
                FirstName = firstName,
                LastName = lastName
            };

            _courseRepoMock.Setup(x => x.GetCourseInstanceById(courseInstanceId)).Returns(value: null);

            
            Assert.ThrowsAsync<Exception>(async () => await _sut.CreateStudent(studentDto));
            _courseRepoMock.Verify(x => x.GetCourseInstanceById(courseInstanceId), Times.Once());
        }

        [Fact()]
        public async void CreateStudentTest_ShouldNotSaveCourseInstance_GivenAStudentIsAlreadyAddedToCourseInstance()
        {
            string firstName = "Falco";
            string lastName = "Wolkorte";

            studentDto = new CreateStudentDTO
            {
                CourseInstanceId = -100,
                FirstName = firstName,
                LastName = lastName
            };

            StudentModel studentDummy = new StudentModel
            {
                FirstName = firstName,
                LastName = lastName
            };

            CourseInstanceModel courseInstanceDummy = new CourseInstanceModel
            {
                StartDate = DateTime.Now,
                Id = -100,
                Students = new List<StudentModel>
                {
                    studentDummy
                }
            };

            _courseRepoMock.Setup(x => x.GetCourseInstanceById(courseInstanceDummy.Id))
                .ReturnsAsync(courseInstanceDummy);

            _studentRepoMock.Setup(x => x.GetStudentByNameAndId(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(studentDummy);

            var result = await _sut.CreateStudent(studentDto);

            _courseRepoMock.Verify(x => x.SaveCourseInstanceInDatabaseAsync(courseInstanceDummy), Times.Never);
            Assert.Same(studentDummy, result);
            
        }

        [Fact()]
        public void CreateStudentTest_ShouldThrowException_GivenACourseInstanceHas12Students()
        {
            CourseInstanceModel courseInstanceDummy = new CourseInstanceModel
            {
                StartDate = DateTime.Now,
                Id = -100,
                Students = new List<StudentModel>
                {
                    It.IsAny<StudentModel>(), It.IsAny<StudentModel>(), It.IsAny<StudentModel>(),
                    It.IsAny<StudentModel>(), It.IsAny<StudentModel>(), It.IsAny<StudentModel>(),
                    It.IsAny<StudentModel>(), It.IsAny<StudentModel>(), It.IsAny<StudentModel>(),
                    It.IsAny<StudentModel>(), It.IsAny<StudentModel>(), It.IsAny<StudentModel>()
                }
            };

            _courseRepoMock.Setup(x => x.GetCourseInstanceById(courseInstanceDummy.Id))
                .ReturnsAsync(courseInstanceDummy);

            Assert.ThrowsAsync<Exception>(async () => await _sut.CreateStudent(studentDto));
            _courseRepoMock.Verify(x => x.SaveCourseInstanceInDatabaseAsync(courseInstanceDummy), Times.Never);
        }

        [Fact()]
        public async void CreateStudentTest_ShouldCreateSaveAndReturnStudentAndSaveCourseInstance_GivenANewStudent()
        {
            string firstName = "Falco";
            string lastName = "Wolkorte";

            studentDto = new CreateStudentDTO
            {
                CourseInstanceId = -100,
                FirstName = firstName,
                LastName = lastName
            };

            StudentModel studentDummy = new StudentModel
            {
                FirstName = firstName,
                LastName = lastName
            };

            CourseInstanceModel courseInstanceDummy = new CourseInstanceModel
            {
                StartDate = DateTime.Now,
                Id = -100,
                Students = new List<StudentModel>()
            };

            _studentRepoMock.Setup(x => x.GetStudentByNameAndId(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(studentDummy);
            _courseRepoMock.Setup(x => x.GetCourseInstanceById(-100)).ReturnsAsync(courseInstanceDummy);

            var result = await _sut.CreateStudent(studentDto);

            _courseRepoMock.Verify(x => x.SaveCourseInstanceInDatabaseAsync(courseInstanceDummy), Times.Once());
            Assert.Equal( firstName, result.FirstName);
            Assert.Equal(lastName, result.LastName);
        }
    }
}