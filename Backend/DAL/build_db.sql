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

