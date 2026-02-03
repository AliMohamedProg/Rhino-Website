using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DAL.UserModel;
using Domains;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DAL.Context;

public partial class WoodDecorContext : IdentityDbContext<ApplicationUser>
{
    public WoodDecorContext()
    {
    }

    public WoodDecorContext(DbContextOptions<WoodDecorContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TbCategory> TbCategories { get; set; }

    public virtual DbSet<TbImage> TbImages { get; set; }

    public virtual DbSet<TbItem> TbItems { get; set; }

    public virtual DbSet<TbOrder> TbOrders { get; set; }

    public virtual DbSet<TbOrderItem> TbOrderItems { get; set; }

    public virtual DbSet<TbReview> TbReviews { get; set; }

    public virtual DbSet<TbSetting> TbSettings { get; set; }

    public virtual DbSet<TbSlider> TbSliders { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<TbCategory>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.NameAr).HasMaxLength(50);
            entity.Property(e => e.NameEn).HasMaxLength(50);
        });

        modelBuilder.Entity<TbImage>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.Product).WithMany(p => p.TbImages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TbImages_TbItems");
        });

        modelBuilder.Entity<TbItem>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Colors).HasMaxLength(50);
            entity.Property(e => e.NameAr).HasMaxLength(50);
            entity.Property(e => e.NameEn).HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 4)");

            entity.HasOne(d => d.Category).WithMany(p => p.TbItems)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TbItems_TbCategories");
        });

        modelBuilder.Entity<TbOrder>(entity =>
        {
            entity.ToTable("TbOrder");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentStatus).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<TbOrderItem>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 4)");

            entity.HasOne(d => d.Item).WithMany(p => p.TbOrderItems)
                .HasForeignKey(d => d.ItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TbOrderItems_TbItems");

            entity.HasOne(d => d.Order).WithMany(p => p.TbOrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TbOrderItems_TbOrder");
        });

        modelBuilder.Entity<TbReview>(entity =>
        {
            entity.HasNoKey();
        });

        modelBuilder.Entity<TbSetting>(entity =>
        {
            entity.HasNoKey();
        });

        modelBuilder.Entity<TbSlider>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("TbSlider");

            entity.Property(e => e.TitleAr).HasMaxLength(50);
            entity.Property(e => e.TitleEn).HasMaxLength(50);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
