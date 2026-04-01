using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    public partial class AddingSecurityColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string[] tables =
            {
                "TbCategories",
                "TbItems",
                "TbImages",
                "TbOrder",
                "TbOrderItems",
                "TbReviews",
                "TbSettings",
                "TbSlider"
            };

            foreach (var table in tables)
            {
                migrationBuilder.AddColumn<Guid>(
                    name: "UpdatedBy",
                    table: table,
                    type: "uniqueidentifier",
                    nullable: true);

                migrationBuilder.AddColumn<int>(
                    name: "CurrentState",
                    table: table,
                    type: "int",
                    nullable: false,
                    defaultValue: 1);

                migrationBuilder.AddColumn<DateTime>(
                    name: "CreatedDate",
                    table: table,
                    type: "datetime2",
                    nullable: true);

                migrationBuilder.AddColumn<Guid>(
                    name: "CreatedBy",
                    table: table,
                    type: "uniqueidentifier",
                    nullable: false,
                    defaultValue: Guid.Empty);

                migrationBuilder.AddColumn<DateTime>(
                    name: "UpdatedDate",
                    table: table,
                    type: "datetime2",
                    nullable: true);
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            string[] tables =
            {
                "TbCategories",
                "TbItems",
                "TbImages",
                "TbOrder",
                "TbOrderItems",
                "TbReviews",
                "TbSettings",
                "TbSlider"
            };

            foreach (var table in tables)
            {
                migrationBuilder.DropColumn("UpdatedBy", table);
                migrationBuilder.DropColumn("CurrentState", table);
                migrationBuilder.DropColumn("CreatedDate", table);
                migrationBuilder.DropColumn("CreatedBy", table);
                migrationBuilder.DropColumn("UpdatedDate", table);
            }
        }
    }
}
