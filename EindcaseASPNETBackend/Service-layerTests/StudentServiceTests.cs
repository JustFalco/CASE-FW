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
    }
}