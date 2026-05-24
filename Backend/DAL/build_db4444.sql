IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [TbCart] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCart] PRIMARY KEY ([Id])
);

CREATE TABLE [TbCategories] (
    [Id] uniqueidentifier NOT NULL,
    [NameAr] nvarchar(50) NOT NULL,
    [NameEn] nvarchar(50) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [ProductsCount] int NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCategories] PRIMARY KEY ([Id])
);

CREATE TABLE [TbOrder] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [OrderDate] datetime NOT NULL,
    [DelivryDate] datetime2 NOT NULL,
    [Country] nvarchar(max) NOT NULL,
    [City] nvarchar(max) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [Total] decimal(18,2) NOT NULL,
    [PhoneNumber] nvarchar(11) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [OrderNumber] nvarchar(max) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [FirstName] nvarchar(50) NOT NULL,
    [LastName] nvarchar(50) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [PaymentMethodName] nvarchar(max) NOT NULL,
    [PaymobTransactionId] nvarchar(max) NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbOrder] PRIMARY KEY ([Id])
);

CREATE TABLE [TbRefreshTokens] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [Token] nvarchar(max) NOT NULL,
    [UserId] nvarchar(max) NOT NULL,
    [Expires] datetime2 NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL DEFAULT 1,
    [CreatedDate] datetime2 NOT NULL DEFAULT (GETDATE()),
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL DEFAULT (GETDATE()),
    CONSTRAINT [PK_TbRefreshTokens] PRIMARY KEY ([Id])
);

CREATE TABLE [TbReviews] (
    [Id] uniqueidentifier NOT NULL,
    [Review] nvarchar(max) NOT NULL,
    [Rating] int NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [UserEmail] nvarchar(max) NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [ProductNameAr] nvarchar(max) NULL,
    [ProductNameEn] nvarchar(max) NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbReviews] PRIMARY KEY ([Id])
);

CREATE TABLE [TbSettings] (
    [LogoUrl] nvarchar(max) NULL,
    [FacebookLink] nvarchar(max) NULL,
    [InstagramLink] nvarchar(max) NULL,
    [TikTokLink] nvarchar(max) NULL,
    [Id] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL
);

CREATE TABLE [TbSliders] (
    [Id] uniqueidentifier NOT NULL,
    [TitleAr] nvarchar(50) NOT NULL,
    [TitleEn] nvarchar(50) NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbSliders] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbItems] (
    [Id] uniqueidentifier NOT NULL,
    [MainImage] nvarchar(max) NOT NULL,
    [NameAr] nvarchar(50) NOT NULL,
    [NameEn] nvarchar(50) NOT NULL,
    [DescriptionAr] nvarchar(max) NOT NULL,
    [DescriptionEn] nvarchar(max) NOT NULL,
    [Price] decimal(18,4) NOT NULL,
    [DiscountAmount] int NULL,
    [CategoryId] uniqueidentifier NOT NULL,
    [OverallRating] int NULL,
    [StockNumber] int NOT NULL,
    [ColorsEn] nvarchar(100) NULL,
    [ColorsAr] nvarchar(100) NULL,
    [MaterialEn] nvarchar(100) NULL,
    [MaterialAr] nvarchar(100) NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbItems_TbCategories] FOREIGN KEY ([CategoryId]) REFERENCES [TbCategories] ([Id])
);

CREATE TABLE [TbCartItem] (
    [Id] uniqueidentifier NOT NULL,
    [CartId] uniqueidentifier NOT NULL,
    [ItemId] uniqueidentifier NOT NULL,
    [Quantity] int NOT NULL,
    [Total] decimal(18,2) NOT NULL,
    [NameAr] nvarchar(max) NOT NULL,
    [NameEn] nvarchar(max) NOT NULL,
    [Image] nvarchar(max) NOT NULL,
    [Color] nvarchar(max) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCartItem] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbCartItem_TbCart_CartId] FOREIGN KEY ([CartId]) REFERENCES [TbCart] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TbCartItem_TbItems_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [TbItems] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbImages] (
    [Id] uniqueidentifier NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbImages_TbItems] FOREIGN KEY ([ProductId]) REFERENCES [TbItems] ([Id])
);

CREATE TABLE [TbOrderItems] (
    [Id] uniqueidentifier NOT NULL,
    [ItemId] uniqueidentifier NOT NULL,
    [nameEn] nvarchar(max) NOT NULL,
    [nameAr] nvarchar(max) NOT NULL,
    [Image] nvarchar(max) NOT NULL,
    [OrderId] uniqueidentifier NOT NULL,
    [Qty] int NOT NULL,
    [UnitPrice] decimal(18,4) NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbOrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbOrderItems_TbItems] FOREIGN KEY ([ItemId]) REFERENCES [TbItems] ([Id]),
    CONSTRAINT [FK_TbOrderItems_TbOrder] FOREIGN KEY ([OrderId]) REFERENCES [TbOrder] ([Id])
);

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

CREATE INDEX [IX_TbCartItem_CartId] ON [TbCartItem] ([CartId]);

CREATE INDEX [IX_TbCartItem_ItemId] ON [TbCartItem] ([ItemId]);

CREATE INDEX [IX_TbImages_ProductId] ON [TbImages] ([ProductId]);

CREATE INDEX [IX_TbItems_CategoryId] ON [TbItems] ([CategoryId]);

CREATE INDEX [IX_TbOrder_Status_OrderDate] ON [TbOrder] ([Status], [OrderDate]);

CREATE INDEX [IX_TbOrder_UserId_OrderDate] ON [TbOrder] ([UserId], [OrderDate]);

CREATE INDEX [IX_TbOrderItems_ItemId] ON [TbOrderItems] ([ItemId]);

CREATE INDEX [IX_TbOrderItems_OrderId] ON [TbOrderItems] ([OrderId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260416154452_createDB', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
EXEC sp_rename N'[TbCartItem].[Quantity]', N'StockNumber', 'COLUMN';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260420161258_renameTheQuantityFieldInTbCartItemToStockNumber', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
EXEC sp_rename N'[TbCartItem].[StockNumber]', N'Quantity', 'COLUMN';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260420214601_RenameTheStockNumberToQty', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbItems] ADD [OldPrice] decimal(18,2) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260421110508_addOldPriceFieldInTbItem', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbItems] ADD [StyleId] uniqueidentifier NULL;

ALTER TABLE [TbItems] ADD [TbStylesId] uniqueidentifier NULL;

CREATE TABLE [TbStyles] (
    [Id] uniqueidentifier NOT NULL,
    [NameAr] nvarchar(max) NOT NULL,
    [NameEn] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [ProductsCount] int NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbStyles] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_TbItems_TbStylesId] ON [TbItems] ([TbStylesId]);

ALTER TABLE [TbItems] ADD CONSTRAINT [FK_TbItems_TbStyles_TbStylesId] FOREIGN KEY ([TbStylesId]) REFERENCES [TbStyles] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260427163414_CreateTbStyles', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbItems] ADD [Dimensions] nvarchar(255) NOT NULL DEFAULT N'';

ALTER TABLE [TbItems] ADD [SKU] nvarchar(100) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260428041052_AddSKUAndDimensions', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbCartItem] ADD [Fabric] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260501024205_addFabricToCartItem', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260501024336_addFabricToCartItemInTheDbHost', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var nvarchar(max);
SELECT @var = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbCartItem]') AND [c].[name] = N'Fabric');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [TbCartItem] DROP CONSTRAINT ' + @var + ';');
ALTER TABLE [TbCartItem] ALTER COLUMN [Fabric] nvarchar(max) NULL;

DECLARE @var1 nvarchar(max);
SELECT @var1 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbCartItem]') AND [c].[name] = N'Color');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [TbCartItem] DROP CONSTRAINT ' + @var1 + ';');
ALTER TABLE [TbCartItem] ALTER COLUMN [Color] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260501024913_makeTheFabricAndColorNullable', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [TbAlliances] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbAlliances] PRIMARY KEY ([Id])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260501031743_addTbAlliances', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [TbProjects] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [AllianceId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbProjects] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbProjects_TbBrands] FOREIGN KEY ([AllianceId]) REFERENCES [TbAlliances] ([Id])
);

CREATE TABLE [TbProjectImages] (
    [Id] uniqueidentifier NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [ProjectId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbProjectImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbProjectImages_TbProjects] FOREIGN KEY ([ProjectId]) REFERENCES [TbProjects] ([Id])
);

CREATE TABLE [TbProjectProducts] (
    [Id] uniqueidentifier NOT NULL,
    [ItemId] uniqueidentifier NOT NULL,
    [ProjectId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbProjectProducts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbProjectProducts_TbItems] FOREIGN KEY ([ItemId]) REFERENCES [TbItems] ([Id]),
    CONSTRAINT [FK_TbProjectProducts_TbProjects] FOREIGN KEY ([ProjectId]) REFERENCES [TbProjects] ([Id])
);

CREATE INDEX [IX_TbProjectImages_ProjectId] ON [TbProjectImages] ([ProjectId]);

CREATE INDEX [IX_TbProjectProducts_ItemId] ON [TbProjectProducts] ([ItemId]);

CREATE INDEX [IX_TbProjectProducts_ProjectId] ON [TbProjectProducts] ([ProjectId]);

CREATE INDEX [IX_TbProjects_AllianceId] ON [TbProjects] ([AllianceId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260501041945_addTbProjectsAndTbProjectImagesAndTbProjectProducts', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbProjects] ADD [MainImage] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260501051537_addMainImageInTbProject', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504030509_localhostDB', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504031300_removeTheFabricIdFromTbitem', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbItems] ADD [FabricId] uniqueidentifier NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504031613_editTheMigration', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504031740_editTheMigration٢', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504031834_editTheMigration3', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504031950_editTheMigration4', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504032139_si', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504032238_aaaa', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var2 nvarchar(max);
SELECT @var2 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbStyles]') AND [c].[name] = N'NameAr');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [TbStyles] DROP CONSTRAINT ' + @var2 + ';');
ALTER TABLE [TbStyles] DROP COLUMN [NameAr];

DECLARE @var3 nvarchar(max);
SELECT @var3 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbSliders]') AND [c].[name] = N'TitleAr');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [TbSliders] DROP CONSTRAINT ' + @var3 + ';');
ALTER TABLE [TbSliders] DROP COLUMN [TitleAr];

DECLARE @var4 nvarchar(max);
SELECT @var4 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbOrderItems]') AND [c].[name] = N'nameAr');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [TbOrderItems] DROP CONSTRAINT ' + @var4 + ';');
ALTER TABLE [TbOrderItems] DROP COLUMN [nameAr];

DECLARE @var5 nvarchar(max);
SELECT @var5 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbItems]') AND [c].[name] = N'ColorsAr');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [TbItems] DROP CONSTRAINT ' + @var5 + ';');
ALTER TABLE [TbItems] DROP COLUMN [ColorsAr];

DECLARE @var6 nvarchar(max);
SELECT @var6 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbItems]') AND [c].[name] = N'ColorsEn');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [TbItems] DROP CONSTRAINT ' + @var6 + ';');
ALTER TABLE [TbItems] DROP COLUMN [ColorsEn];

DECLARE @var7 nvarchar(max);
SELECT @var7 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbItems]') AND [c].[name] = N'DescriptionAr');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [TbItems] DROP CONSTRAINT ' + @var7 + ';');
ALTER TABLE [TbItems] DROP COLUMN [DescriptionAr];

DECLARE @var8 nvarchar(max);
SELECT @var8 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbItems]') AND [c].[name] = N'NameAr');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [TbItems] DROP CONSTRAINT ' + @var8 + ';');
ALTER TABLE [TbItems] DROP COLUMN [NameAr];

DECLARE @var9 nvarchar(max);
SELECT @var9 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbCategories]') AND [c].[name] = N'NameAr');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [TbCategories] DROP CONSTRAINT ' + @var9 + ';');
ALTER TABLE [TbCategories] DROP COLUMN [NameAr];

DECLARE @var10 nvarchar(max);
SELECT @var10 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbCartItem]') AND [c].[name] = N'NameAr');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [TbCartItem] DROP CONSTRAINT ' + @var10 + ';');
ALTER TABLE [TbCartItem] DROP COLUMN [NameAr];

EXEC sp_rename N'[TbStyles].[NameEn]', N'Name', 'COLUMN';

EXEC sp_rename N'[TbSliders].[TitleEn]', N'Title', 'COLUMN';

EXEC sp_rename N'[TbOrderItems].[nameEn]', N'Name', 'COLUMN';

EXEC sp_rename N'[TbItems].[NameEn]', N'Name', 'COLUMN';

EXEC sp_rename N'[TbItems].[MaterialEn]', N'Material', 'COLUMN';

EXEC sp_rename N'[TbItems].[MaterialAr]', N'Colors', 'COLUMN';

EXEC sp_rename N'[TbItems].[DescriptionEn]', N'Description', 'COLUMN';

EXEC sp_rename N'[TbCategories].[NameEn]', N'Name', 'COLUMN';

EXEC sp_rename N'[TbCartItem].[NameEn]', N'Name', 'COLUMN';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504044725_PendingChanges', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
EXEC sp_rename N'[TbOrderItems].[Image]', N'MainImage', 'COLUMN';

ALTER TABLE [TbOrderItems] ADD [TbCollectionsId] uniqueidentifier NULL;

ALTER TABLE [TbImages] ADD [TbCollectionsId] uniqueidentifier NULL;

CREATE TABLE [TbCollections] (
    [Id] uniqueidentifier NOT NULL,
    [MainImage] nvarchar(max) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [FabricId] uniqueidentifier NULL,
    [Description] nvarchar(max) NOT NULL,
    [OldPrice] decimal(18,2) NULL,
    [Price] decimal(18,2) NOT NULL,
    [StyleId] uniqueidentifier NULL,
    [Dimensions] nvarchar(max) NOT NULL,
    [SKU] nvarchar(max) NOT NULL,
    [DiscountAmount] int NULL,
    [CategoryId] uniqueidentifier NOT NULL,
    [OverallRating] int NULL,
    [StockNumber] int NOT NULL,
    [Colors] nvarchar(max) NULL,
    [Material] nvarchar(max) NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCollections] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbCollections_TbCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [TbCategories] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbItemFabrics] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbItemFabrics] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbItemFabrics_TbItems_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [TbItems] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbCartCollection] (
    [Id] uniqueidentifier NOT NULL,
    [CartId] uniqueidentifier NOT NULL,
    [CollectionId] uniqueidentifier NOT NULL,
    [Quantity] int NOT NULL,
    [Total] decimal(18,2) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Image] nvarchar(max) NOT NULL,
    [Color] nvarchar(max) NULL,
    [Fabric] nvarchar(max) NULL,
    [Price] decimal(18,2) NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCartCollection] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbCartCollection_TbCart_CartId] FOREIGN KEY ([CartId]) REFERENCES [TbCart] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TbCartCollection_TbCollections_CollectionId] FOREIGN KEY ([CollectionId]) REFERENCES [TbCollections] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbCollectionFabrics] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [CollectionId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCollectionFabrics] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbCollectionFabrics_TbCollections_CollectionId] FOREIGN KEY ([CollectionId]) REFERENCES [TbCollections] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbCollectionImages] (
    [Id] uniqueidentifier NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [CollectionId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCollectionImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbCollectionImages_TbCollections_CollectionId] FOREIGN KEY ([CollectionId]) REFERENCES [TbCollections] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbOrderCollection] (
    [Id] uniqueidentifier NOT NULL,
    [CollectionId] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [MainImage] nvarchar(max) NOT NULL,
    [OrderId] uniqueidentifier NOT NULL,
    [Qty] int NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [CollectionsId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbOrderCollection] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbOrderCollection_TbCollections_CollectionsId] FOREIGN KEY ([CollectionsId]) REFERENCES [TbCollections] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TbOrderCollection_TbOrder_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [TbOrder] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_TbOrderItems_TbCollectionsId] ON [TbOrderItems] ([TbCollectionsId]);

CREATE INDEX [IX_TbImages_TbCollectionsId] ON [TbImages] ([TbCollectionsId]);

CREATE INDEX [IX_TbCartCollection_CartId] ON [TbCartCollection] ([CartId]);

CREATE INDEX [IX_TbCartCollection_CollectionId] ON [TbCartCollection] ([CollectionId]);

CREATE INDEX [IX_TbCollectionFabrics_CollectionId] ON [TbCollectionFabrics] ([CollectionId]);

CREATE INDEX [IX_TbCollectionImages_CollectionId] ON [TbCollectionImages] ([CollectionId]);

CREATE INDEX [IX_TbCollections_CategoryId] ON [TbCollections] ([CategoryId]);

CREATE INDEX [IX_TbItemFabrics_ProductId] ON [TbItemFabrics] ([ProductId]);

CREATE INDEX [IX_TbOrderCollection_CollectionsId] ON [TbOrderCollection] ([CollectionsId]);

CREATE INDEX [IX_TbOrderCollection_OrderId] ON [TbOrderCollection] ([OrderId]);

ALTER TABLE [TbImages] ADD CONSTRAINT [FK_TbImages_TbCollections_TbCollectionsId] FOREIGN KEY ([TbCollectionsId]) REFERENCES [TbCollections] ([Id]);

ALTER TABLE [TbOrderItems] ADD CONSTRAINT [FK_TbOrderItems_TbCollections_TbCollectionsId] FOREIGN KEY ([TbCollectionsId]) REFERENCES [TbCollections] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260505200114_addTbCollectionsAndTheCollectionTables', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbImages] DROP CONSTRAINT [FK_TbImages_TbCollections_TbCollectionsId];

ALTER TABLE [TbOrderItems] DROP CONSTRAINT [FK_TbOrderItems_TbCollections_TbCollectionsId];

DROP INDEX [IX_TbOrderItems_TbCollectionsId] ON [TbOrderItems];

DROP INDEX [IX_TbImages_TbCollectionsId] ON [TbImages];

DECLARE @var11 nvarchar(max);
SELECT @var11 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbOrderItems]') AND [c].[name] = N'TbCollectionsId');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [TbOrderItems] DROP CONSTRAINT ' + @var11 + ';');
ALTER TABLE [TbOrderItems] DROP COLUMN [TbCollectionsId];

DECLARE @var12 nvarchar(max);
SELECT @var12 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbImages]') AND [c].[name] = N'TbCollectionsId');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [TbImages] DROP CONSTRAINT ' + @var12 + ';');
ALTER TABLE [TbImages] DROP COLUMN [TbCollectionsId];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260506041441_renameTheTbOrderCollectionsAndTbCollectionImagesInTbCollection', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260507030420_TbCollectionItems', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [TbCollectionItems] (
    [Id] uniqueidentifier NOT NULL,
    [ItemId] uniqueidentifier NOT NULL,
    [CollectionId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbCollectionItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbCollectionItems_TbCollections_CollectionId] FOREIGN KEY ([CollectionId]) REFERENCES [TbCollections] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TbCollectionItems_TbItems_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [TbItems] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_TbCollectionItems_CollectionId] ON [TbCollectionItems] ([CollectionId]);

CREATE INDEX [IX_TbCollectionItems_ItemId] ON [TbCollectionItems] ([ItemId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260507031105_addTbCollectionItemsInTbCollection', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [TbChanges] (
    [Id] uniqueidentifier NOT NULL,
    [NewDimensions] nvarchar(max) NOT NULL,
    [NewSKU] nvarchar(max) NOT NULL,
    [OverPrice] nvarchar(max) NOT NULL,
    [NewName] nvarchar(max) NOT NULL,
    [NewDescription] nvarchar(max) NOT NULL,
    [CollectionId] uniqueidentifier NOT NULL,
    [TbCollectionsId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbChanges] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbChanges_TbCollections_TbCollectionsId] FOREIGN KEY ([TbCollectionsId]) REFERENCES [TbCollections] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TbChangeImages] (
    [Id] uniqueidentifier NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [ChangeId] uniqueidentifier NOT NULL,
    [TbChangesId] uniqueidentifier NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbChangeImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TbChangeImages_TbChanges_TbChangesId] FOREIGN KEY ([TbChangesId]) REFERENCES [TbChanges] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_TbChangeImages_TbChangesId] ON [TbChangeImages] ([TbChangesId]);

CREATE INDEX [IX_TbChanges_TbCollectionsId] ON [TbChanges] ([TbCollectionsId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260509114439_addTbChangesAndTbChangesImages', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbChanges] ADD [ChangeName] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260510040421_addChangeNameInTbChanges', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var13 nvarchar(max);
SELECT @var13 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbChanges]') AND [c].[name] = N'OverPrice');
IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [TbChanges] DROP CONSTRAINT ' + @var13 + ';');
ALTER TABLE [TbChanges] ALTER COLUMN [OverPrice] decimal(18,2) NOT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260510044417_makeTheOverPriceDecimalNotString', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260510084148_addTbChangesAndChangesIMagesinDBContext', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260512045732_addIDs', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbChanges] DROP CONSTRAINT [FK_TbChanges_TbCollections_TbCollectionsId];

DROP INDEX [IX_TbChanges_TbCollectionsId] ON [TbChanges];

DECLARE @var14 nvarchar(max);
SELECT @var14 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TbChanges]') AND [c].[name] = N'TbCollectionsId');
IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [TbChanges] DROP CONSTRAINT ' + @var14 + ';');
ALTER TABLE [TbChanges] DROP COLUMN [TbCollectionsId];

CREATE INDEX [IX_TbChanges_CollectionId] ON [TbChanges] ([CollectionId]);

ALTER TABLE [TbChanges] ADD CONSTRAINT [FK_TbChanges_TbCollections_CollectionId] FOREIGN KEY ([CollectionId]) REFERENCES [TbCollections] ([Id]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260512053414_FixTbChangesForeignKey', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbCollections] ADD [ItemsCount] int NOT NULL DEFAULT 0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260512072536_addItemCountInTbCollection', N'10.0.2');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TbItems] ADD [TypeId] uniqueidentifier NULL;

CREATE TABLE [TbTypes] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [CurrentState] int NOT NULL,
    [CreatedDate] datetime2 NULL,
    [CreatedBy] uniqueidentifier NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_TbTypes] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_TbItems_TypeId] ON [TbItems] ([TypeId]);

ALTER TABLE [TbItems] ADD CONSTRAINT [FK_TbItems_TbTypes_TypeId] FOREIGN KEY ([TypeId]) REFERENCES [TbTypes] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260512080936_addTbTypes', N'10.0.2');

COMMIT;
GO

