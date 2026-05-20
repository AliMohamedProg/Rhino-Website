using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class renameTheTbOrderCollectionsAndTbCollectionImagesInTbCollection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TbImages_TbCollections_TbCollectionsId",
                table: "TbImages");

            migrationBuilder.DropForeignKey(
                name: "FK_TbOrderItems_TbCollections_TbCollectionsId",
                table: "TbOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_TbOrderItems_TbCollectionsId",
                table: "TbOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_TbImages_TbCollectionsId",
                table: "TbImages");

            migrationBuilder.DropColumn(
                name: "TbCollectionsId",
                table: "TbOrderItems");

            migrationBuilder.DropColumn(
                name: "TbCollectionsId",
                table: "TbImages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TbCollectionsId",
                table: "TbOrderItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TbCollectionsId",
                table: "TbImages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TbOrderItems_TbCollectionsId",
                table: "TbOrderItems",
                column: "TbCollectionsId");

            migrationBuilder.CreateIndex(
                name: "IX_TbImages_TbCollectionsId",
                table: "TbImages",
                column: "TbCollectionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_TbImages_TbCollections_TbCollectionsId",
                table: "TbImages",
                column: "TbCollectionsId",
                principalTable: "TbCollections",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TbOrderItems_TbCollections_TbCollectionsId",
                table: "TbOrderItems",
                column: "TbCollectionsId",
                principalTable: "TbCollections",
                principalColumn: "Id");
        }
    }
}
