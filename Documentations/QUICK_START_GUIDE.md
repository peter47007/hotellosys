# HotelloSys - Quick Start Guide

## 🚀 Get Started in 5 Steps

### Step 1: Download & Install (30 minutes)

```bash
# Download .NET 8 SDK
https://dotnet.microsoft.com/en-us/download/dotnet/8.0

# Download Visual Studio Community 2022
https://visualstudio.microsoft.com/download/

# Your PostgreSQL: Already installed ✓
```

### Step 2: Create Project Structure (10 minutes)

```bash
cd C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS
mkdir src
cd src

# Create solution
dotnet new sln -n HotelloSys

# Create projects
dotnet new classlib -n HotelloSys.Core
dotnet new classlib -n HotelloSys.Data
dotnet new wpf -n HotelloSys.UI
dotnet new webapi -n HotelloSys.API
dotnet new xunit -n HotelloSys.Tests

# Add to solution
dotnet sln HotelloSys.sln add HotelloSys.Core/HotelloSys.Core.csproj
dotnet sln HotelloSys.sln add HotelloSys.Data/HotelloSys.Data.csproj
dotnet sln HotelloSys.sln add HotelloSys.UI/HotelloSys.UI.csproj
dotnet sln HotelloSys.sln add HotelloSys.API/HotelloSys.API.csproj
dotnet sln HotelloSys.sln add HotelloSys.Tests/HotelloSys.Tests.csproj
```

### Step 3: Install NuGet Packages (5 minutes)

```bash
# Run from src directory
dotnet add HotelloSys.Data/HotelloSys.Data.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add HotelloSys.Data/HotelloSys.Data.csproj package Microsoft.EntityFrameworkCore.Tools

dotnet add HotelloSys.Core/HotelloSys.Core.csproj package Microsoft.Extensions.DependencyInjection
dotnet add HotelloSys.Core/HotelloSys.Core.csproj package Microsoft.Extensions.Logging

dotnet add HotelloSys.UI/HotelloSys.UI.csproj package MvvmLightLibs
```

### Step 4: Create Database (5 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hotello_sys;

# Exit
\q
```

### Step 5: Open in Visual Studio (2 minutes)

```bash
# From src directory
start HotelloSys.sln
```

---

## 📋 Key Files Location

| Component | Path |
|-----------|------|
| **Solution** | `C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src\HotelloSys.sln` |
| **Database Context** | `HotelloSys.Data\Context\HotelloSysDbContext.cs` |
| **Employee Model** | `HotelloSys.Core\Models\Employee.cs` |
| **Auth Service** | `HotelloSys.Core\Services\AuthenticationService.cs` |
| **Login View** | `HotelloSys.UI\Views\LoginWindow.xaml` |
| **Main Window** | `HotelloSys.UI\Views\MainWindow.xaml` |

---

## 🔧 Configuration

**File**: `HotelloSys.Data\appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=hotello_sys;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

---

## ✅ First Test

1. **Open HotelloSys.sln in Visual Studio**
2. **Build**: Press `Ctrl+Shift+B`
3. **Run**: Press `F5`
4. Should open a blank WPF window

---

## 📚 Full Documentation

See: `HotelloSys_Complete_Development_Plan.md`

---

## 🎯 Timeline

- **Phase 1 (Weeks 1-4)**: Foundation & Core System
- **Phase 2 (Weeks 5-8)**: Employee & Hotel Management
- **Phase 3 (Weeks 9-13)**: Room Management & Reservations
- **... (More phases follow)**
- **Total**: 12 months or less

---

## 💡 Tips

1. **Commit early & often** to GitHub
2. **Write tests** as you code
3. **Follow MVVM** pattern for WPF code
4. **Keep models thin** - logic in services
5. **Use repositories** for data access

---

**Ready? Let's build HotelloSys!** 🏨
