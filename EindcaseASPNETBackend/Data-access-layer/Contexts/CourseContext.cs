﻿using System.Reflection.Emit;
using Data_access_layer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data_access_layer.Contexts;

public class CourseContext : DbContext
{
    private readonly IConfiguration _configuration;
    public DbSet<CourseModel> Courses { get; set; }
    public DbSet<CourseInstanceModel> CourseInstances { get; set; }
    public DbSet<StudentModel> Students { get; set; }


    private string dbConnectionString;

    public CourseContext(IConfiguration configuration)
    {
        _configuration = configuration;
        dbConnectionString = _configuration.GetConnectionString("LocalConnection");
    }

    public CourseContext(DbContextOptions<DefaultContext> options, IConfiguration configuration) : base(options)
    {
        _configuration = configuration;
        dbConnectionString = _configuration.GetConnectionString("LocalConnection");
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(connectionString: dbConnectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StudentModel>().HasData(new StudentModel
        {
            FirstName = "Falco",
            LastName = "Wolkorte",
            Id = -100
        });

        modelBuilder.Entity<CourseModel>().HasData(new CourseModel
        {
            Id = -100,
            AmountOfDays = 3,
            Title = "Test course"
        });

        modelBuilder.Entity<CourseInstanceModel>().HasData(new CourseInstanceModel
        {
            Id = -100,
            StartDate = DateTime.Now,
            Students = new List<StudentModel>(),
            CourseId = -100,
        });
    }
}