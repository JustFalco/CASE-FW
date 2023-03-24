using Xunit;
using Service_layer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_access_layer.Contexts;
using Data_access_layer.DTOs;
using Data_access_layer.Models;
using Data_access_layer.Repositories;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.EntityFrameworkCore;

namespace Service_layer.Tests
{
    public class CourseServiceTests
    {

        private CourseService _sut;
        private Mock<ICourseRepository> _courseRepoMock;
        

        public CourseServiceTests()
        {
            _courseRepoMock = new Mock<ICourseRepository>();
            

            _sut = new CourseService(_courseRepoMock.Object);
        }

        //https://stackoverflow.com/questions/36858542/how-to-mock-an-iformfile-for-a-unit-integration-test-in-asp-net-core
        private IFormFile CreateTestFormFile(string fileName, string content)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(content);

            return new FormFile(
                baseStream: new MemoryStream(bytes),
                baseStreamOffset: 0,
                length: bytes.Length,
                name: "Data",
                fileName: fileName
            );
        }

        [Fact()]
        public async void getCoursesByWeekAndYearTest_ShouldReturnCourseInstances_GivenValidYearAndWeek()
        {
            int year = 2023;
            DateTime jan1 = new DateTime(year, 1, 1);
            
            var data = new List<CourseInstanceModel> { 
                new CourseInstanceModel { StartDate = jan1.AddDays(2) }, 
                new CourseInstanceModel { StartDate = jan1.AddDays(7) }, 
                new CourseInstanceModel { StartDate = jan1.AddDays(10) }, 
                new CourseInstanceModel { StartDate = jan1.AddDays(20) }}.AsQueryable();

            var mockSet = new Mock<DbSet<CourseInstanceModel>>();
            mockSet.As<IQueryable<CourseInstanceModel>>().Setup(x => x.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<CourseInstanceModel>>().Setup(x => x.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<CourseInstanceModel>>().Setup(x => x.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<CourseInstanceModel>>().Setup(x => x.GetEnumerator()).Returns(() => data.GetEnumerator());

            /*var courseContextMock = new Mock<CourseContext>();
            courseContextMock.Setup((c) => c.CourseInstances).Returns(mockSet.Object);*/
            var courseContextMock = new CourseContext { CourseInstances = mockSet.Object };


            CourseRepository _courseRepository = new CourseRepository(courseContextMock);
            CourseService sut = new CourseService(_courseRepository);

            var result = await sut.getCoursesByWeekAndYear(1, year);

            Assert.Equal(2, result.Count);
        }

        [Fact()]
        public async void getCoursesByWeekAndYearTest_ShouldThrowException_GivenInvalidWeek()
        {
            Assert.ThrowsAsync<Exception>(async () => _sut.getCoursesByWeekAndYear(0, 2023));
            Assert.ThrowsAsync<Exception>(async () => _sut.getCoursesByWeekAndYear(100, 2023));
        }

        [Fact()]
        public void IsFileInCorrectFormatTest_ShouldReturnTrue_GivenCorrectFile()
        {
            //Content van files is gekopierd uit goedvoorbeeld5.txt
            IFormFile correctFile1 = CreateTestFormFile("correct.txt",
                "Titel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n");

            IFormFile correctFile2 = CreateTestFormFile("correct2.txt", "Titel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 06/07/2020\r\n\r\nTitel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 08/07/2020\r\n\r\nTitel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 29/06/2020\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 29/06/2020\r\n");

            var result1 = _sut.IsFileInCorrectFormat(correctFile1);
            var result2 = _sut.IsFileInCorrectFormat(correctFile2);

            Assert.True(result1);
            Assert.True(result2);
        }

        [Fact()]
        public void IsFileInCorrectFormatTest_ShouldReturnFalse_GivenIncorrectFile()
        {
            //Content van files is gekopierd uit fout3.txt en fout5.txt
            IFormFile incorrectFile1 = CreateTestFormFile("incorrect.txt",
                "Titel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 8-10-2018\r\n");

            IFormFile incorrectFile2 = CreateTestFormFile("incorrect2.txt", "Titel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 8/10/2018\r\nTitel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 10/10/2018\r\n");

            var result1 = _sut.IsFileInCorrectFormat(incorrectFile1);
            var result2 = _sut.IsFileInCorrectFormat(incorrectFile2);

            Assert.False(result1);
            Assert.False(result2);
        }

        [Fact()]
        public void handleFormFileTest_ShouldReturnListWithNineItems_GivenACorrectFileWithNineCourses()
        {
            //Content van files is gekopierd uit goedvoorbeeld5.txt
            IFormFile correctFile = CreateTestFormFile("correct.txt", "Titel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 06/07/2020\r\n\r\nTitel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 08/07/2020\r\n\r\nTitel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 29/06/2020\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 29/06/2020\r\n");

            var result = _sut.handleFormFile(correctFile);

            Assert.Equal(9, result.Count);
            Assert.Equal("C# Programmeren", result[0].Title);
        }

        [Fact()]
        public void handleFormFileTest_ShouldThrowException_GivenAIncorrectFile()
        {
            //Content van file is gekopierd uit fout3.txt
            IFormFile incorrectFile = CreateTestFormFile("incorrect.txt",
                "Titel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 8-10-2018\r\n");

            Assert.Throws<Exception>(() => _sut.handleFormFile(incorrectFile));

        }

        [Fact()]
        public async void generateCourseTest_ShouldReturnNewCourse_GivenNewFileObject()
        {
            FileObject fileObjectDummy = new FileObject
            {
                AmountOfDays = 5,
                CourseCode = "IAMFW",
                startDate = DateTime.Now,
                Title = "Test Course"
            };

            CourseModel expectedCourse = new CourseModel
            {
                AmountOfDays = 5,
                CourseCode = "IAMFW",
                Title = "Test Course",
                Id = -100
            };

            _courseRepoMock.Setup(x => x.GetCourseByCodeAsync(fileObjectDummy.CourseCode))
                .ReturnsAsync(value: null);
            _courseRepoMock.Setup(x => x.SaveCourseInDatabaseAsync(It.IsAny<CourseModel>())).ReturnsAsync(value: expectedCourse);

            var result = await _sut.generateCourse(fileObjectDummy);

            _courseRepoMock.Verify(x => x.SaveCourseInDatabaseAsync(It.IsAny<CourseModel>()), Times.Once);
            Assert.Equal(expectedCourse, result);
        }

        [Fact()]
        public async void generateCourseTest_ShouldThrowError_GivenFileObjectWithMoreThanFiveDays()
        {
            FileObject fileObjectDummy = new FileObject
            {
                AmountOfDays = 6,
                CourseCode = "IAMFW",
                startDate = DateTime.Now,
                Title = "Test Course"
            };

            _courseRepoMock.Setup(x => x.GetCourseByCodeAsync(fileObjectDummy.CourseCode))
                .ReturnsAsync(value: null);

            Assert.ThrowsAsync<Exception>(async () => await _sut.generateCourse(fileObjectDummy));

            _courseRepoMock.Verify(x => x.SaveCourseInDatabaseAsync(It.IsAny<CourseModel>()), Times.Never);
            
        }

        [Fact()]
        public async void generateCourseTest_ShouldNotSaveExistingCourseInDatabase_GivenExistingCourse()
        {
            FileObject fileObjectDummy = new FileObject
            {
                AmountOfDays = 5,
                CourseCode = "IAMFW",
                startDate = DateTime.Now,
                Title = "Test Course"
            };

            CourseModel expectedCourse = new CourseModel
            {
                AmountOfDays = 5,
                CourseCode = "IAMFW",
                Title = "Test Course",
                Id = -100
            };

            _courseRepoMock.Setup(x => x.GetCourseByCodeAsync(fileObjectDummy.CourseCode))
                .ReturnsAsync(value: expectedCourse);
            _courseRepoMock.Setup(x => x.SaveCourseInDatabaseAsync(It.IsAny<CourseModel>())).ReturnsAsync(value: expectedCourse);

            var result = await _sut.generateCourse(fileObjectDummy);

            _courseRepoMock.Verify(x => x.SaveCourseInDatabaseAsync(It.IsAny<CourseModel>()), Times.Never);
            Assert.Equal(expectedCourse, result);
        }

        [Fact()]
        public async void generateCourseInstanceTest_ShouldReturnAndSaveNewCourseInstance_GivenNonExistingCourseInstance()
        {
            FileObject fileObjectDummy = new FileObject
            {
                AmountOfDays = 5,
                CourseCode = "IAMFW",
                startDate = DateTime.Now,
                Title = "Test Course"
            };

            CourseModel course = new CourseModel
            {
                AmountOfDays = 5,
                CourseCode = "IAMFW",
                Id = -100,
                Title = "Test Course"
            };

            CourseInstanceModel courseInstance = new CourseInstanceModel
            {
                Course = course,
                Id = -100,
                CourseId = -100,
                StartDate = DateTime.Now
            };

            _courseRepoMock
                .Setup(x => x.GetCourseInstanceModelByDateAndCourseCode(It.IsAny<DateTime>(), It.IsAny<string>()))
                .Returns(value: null);

            _courseRepoMock.Setup(x => x.GetCourseByCodeAsync(It.IsAny<string>())).ReturnsAsync(value: course);
            _courseRepoMock.Setup(x => x.SaveCourseInstanceInDatabaseAsync(It.IsAny<CourseInstanceModel>()))
                .ReturnsAsync(value: courseInstance);

            var result = await _sut.generateCourseInstance(fileObjectDummy);

            _courseRepoMock.Verify(x => x.SaveCourseInstanceInDatabaseAsync(It.IsAny<CourseInstanceModel>()),
                Times.Once);
            Assert.Equal(courseInstance, result);
        }

        [Fact()]
        public async void generateCourseInstanceTest_ShouldReturnCourseInstanceFromDatabase_GivenExistingCourseInstance()
        {
            FileObject fileObjectDummy = new FileObject
            {
                AmountOfDays = 5,
                CourseCode = "IAMFW",
                startDate = DateTime.Now,
                Title = "Test Course"
            };

            CourseInstanceModel courseInstance = new CourseInstanceModel
            {
                Id = -100,
                CourseId = -100,
                StartDate = DateTime.Now
            };

            _courseRepoMock
                .Setup(x => x.GetCourseInstanceModelByDateAndCourseCode(It.IsAny<DateTime>(), It.IsAny<string>()))
                .Returns(value: courseInstance);


            var result = await _sut.generateCourseInstance(fileObjectDummy);


            _courseRepoMock.Verify(x => x.SaveCourseInstanceInDatabaseAsync(It.IsAny<CourseInstanceModel>()),
                Times.Never);
            Assert.Equal(courseInstance, result);
        }

        [Fact()]
        public async void handleCourseCreationWithFileTest_ShouldReturnErrorStringWithLineNum_GivenAnIncorrectFile()
        {
            //Content van file is gekopierd uit fout3.txt
            IFormFile incorrectFile = CreateTestFormFile("incorrect.txt",
                "Titel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 8-10-2018\r\n");

            var result = await _sut.handleCourseCreationWithFile(incorrectFile, DateTime.MinValue, DateTime.MaxValue);

            Assert.Equal(4, result.LineNrError);
            Assert.Equal("File is not in correct format", result.Errors[0]);
        }

        [Fact()]
        public async void handleCourseCreationWithFileTest_ShouldReturnSuccesString_GivenACorrectFile()
        {
            //TODO HIer nog even naar kijken ivb met de return string
            //Content van files is gekopierd uit goedvoorbeeld5.txt
            IFormFile correctFile = CreateTestFormFile("correct.txt", "Titel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 08/07/2020\r\n\r\nTitel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n");

            var result = await _sut.handleCourseCreationWithFile(correctFile, DateTime.MinValue, DateTime.MaxValue);

            Assert.Equal(4, result.CreatedCourses);
            Assert.Equal(4, result.CreatedCourseInstances);
            Assert.Equal(0, result.DuplicateCourseInstances);
        }

        [Fact()]
        public async void handleCourseCreationWithFileTest_ShouldOnlyCreateCourseInstancesThatEndOnOrAfterStartDate_GivenMultipleFileObjects()
        {
            IFormFile correctFile = CreateTestFormFile("correct.txt", "Titel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 08/07/2020\r\n\r\nTitel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2024\r\n");

            _courseRepoMock
                .Setup(x => x.GetCourseInstanceModelByDateAndCourseCode(It.IsAny<DateTime>(), "JPA"))
                .Returns(It.IsAny<CourseInstanceModel>());

            var result =
                await _sut.handleCourseCreationWithFile(correctFile, DateTime.Parse("24/03/2023"), DateTime.MaxValue);
            
            Assert.Equal(3, result.CreatedCourses);
            Assert.Equal(3, result.CreatedCourseInstances);
            Assert.Equal(0, result.DuplicateCourseInstances);
        }

        [Fact()]
        public async void handleCourseCreationWithFileTest_ShouldOnlyCreateCourseInstancesThatStartOnOrBeforeTheEndDate_GivenMultipleFileObjects()
        {
            IFormFile correctFile = CreateTestFormFile("correct.txt", "Titel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 08/07/2020\r\n\r\nTitel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 06/07/2020\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2024\r\n");


            var result =
                await _sut.handleCourseCreationWithFile(correctFile, DateTime.MinValue, DateTime.Parse("08/07/2020"));

            Assert.Equal(2, result.CreatedCourses);
            Assert.Equal(2, result.CreatedCourseInstances);
            Assert.Equal(0, result.DuplicateCourseInstances);

        }

        [Fact()]
        public async void handleCourseCreationWithFileTest_ShouldOnlyCreateCourseInstancesThatAreNotYetInTheSystem_GivenMultipleFileObjects()
        {
            IFormFile correctFile = CreateTestFormFile("correct.txt", "Titel: Java Persistence API\r\nCursuscode: JPA\r\nDuur: 2 dagen\r\nStartdatum: 08/07/2020\r\n\r\nTitel: C# Programmeren\r\nCursuscode: CNETIN\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Fundamentals\r\nCursuscode: AZF\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2023\r\n\r\nTitel: Azure Advanced\r\nCursuscode: AZA\r\nDuur: 5 dagen\r\nStartdatum: 20/03/2024\r\n");

            _courseRepoMock
                .Setup(x => x.CheckIfCourseInstanceExists(It.IsAny<DateTime>(), "JPA"))
                .Returns(true);

            _courseRepoMock
                .Setup(x => x.CheckIfCourseInstanceExists(It.IsAny<DateTime>(), "AZA"))
                .Returns(true);

            var result =
                await _sut.handleCourseCreationWithFile(correctFile, DateTime.MinValue, DateTime.MaxValue);

            Assert.Equal(2, result.CreatedCourses);
            Assert.Equal(2, result.CreatedCourseInstances);
            Assert.Equal(2, result.DuplicateCourseInstances);
        }

        [Fact()]
        public async void GetCourseInstanceByIdTest_ShouldThrowExecption_GivenThatNoCourseInstanceIsFound()
        {
            int id = -100;
            _courseRepoMock.Setup(x => x.GetCourseInstanceById(id)).ReturnsAsync(value:null);

            Assert.ThrowsAsync<Exception>(async () => await _sut.GetCourseInstanceById(id));
        }

        [Fact()]
        public async void GetCourseInstanceByIdTest_ShouldReturnCourseInstance_GivenAValidId()
        {
            int id = -100;
            CourseInstanceModel courseInstance = new CourseInstanceModel
            {
                Id = id
            };

            _courseRepoMock.Setup(x => x.GetCourseInstanceById(id)).ReturnsAsync(courseInstance);

            var result = await _sut.GetCourseInstanceById(id);

            Assert.Equal(courseInstance, result);
            _courseRepoMock.Verify(x => x.GetCourseInstanceById(id), Times.Once);

        }
    }
}

/*
                                     .--.  .--.
                                    /    \/    \
                                   | .-.  .-.   \
                                   |/_  |/_  |   \
                                   || `\|| `\|    `----.
                                   |\0_/ \0_/    --,    \_
                 .--"""""-.       /              (` \     `-.
                /          \-----'-.              \          \
                \  () ()                         /`\          \
                |                         .___.-'   |          \
                \                        /` \|      /           ;
                 `-.___             ___.' .-.`.---.|             \
                    \| ``-..___,.-'`\| / /   /     |              `\
                     `      \|      ,`/ /   /   ,  /
                             `      |\ /   /    |\/
 See you later, alligator!     ,   .'`-;   '     \/
                         ,    |\-'  .'   ,   .-'`
                       .-|\--;`` .-'     |\.'
                      ( `"'-.|\ (___,.--'`'   
                       `-.    `"`          _.--'
                          `.          _.-'`-.
                            `''---''``        `
