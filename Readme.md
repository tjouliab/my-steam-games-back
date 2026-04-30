-  How to generate a migration with EF Core ?

In project root, generate the Migrations file by running:
dotnet ef migrations add {CustomName}

Now, apply the migration and create the DB by running:
dotnet ef database update

To see the generated result:
dotnet ef migrations script