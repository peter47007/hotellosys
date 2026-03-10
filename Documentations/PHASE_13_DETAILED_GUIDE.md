# Phase 13: Mobile App Development - DETAILED GUIDE

**Phase Duration**: 14 weeks (Weeks 53-66)  
**Estimated Hours**: 336-350 hours  
**Weekly Target**: 24-25 hours/week  
**Complexity**: Very High  
**Dependencies**: Phases 1-12 (All desktop systems complete, Web API fully functional)

**IMPORTANT**: This phase develops the cross-platform iOS/Android mobile app for customers to search hotels, view rooms, make reservations, and manage loyalty points.

---

## Phase Overview

Phase 13 delivers a comprehensive mobile application for customers across iOS and Android platforms using .NET MAUI. The app provides real-time synchronization with hotel systems and enables end-to-end booking experiences with integrated payment processing.

### Key Objectives:
- Set up .NET MAUI cross-platform project structure
- Build hotel discovery and search features
- Implement room details and availability views
- Create reservation booking workflow
- Integrate down-payment collection system
- Build room hold countdown timer UI
- Implement customer profile management
- Add loyalty points tracking (per hotel)
- Create push notifications infrastructure
- Implement cross-hotel synchronization
- Build offline-first data caching
- Prepare for App Store/Play Store deployment
- Execute store submission processes

### Business Value:
- Direct customer access to bookings
- Real-time availability across hotels
- Reduces booking friction (web/calls eliminated)
- Unified customer profiles across properties
- Automated payment collection before arrival
- Loyalty program visibility and engagement
- Mobile-first market reach
- Revenue increase through user convenience

---

## Weekly Breakdown

### **Week 1: .NET MAUI Project Setup & Architecture (24-25 hours)**

**Objective**: Initialize mobile project structure and establish CI/CD pipeline

#### Tasks:

**1. MAUI Project Initialization**
```bash
# Create new MAUI project
dotnet new maui -n HotelloSys.Mobile -o HotelloSys.Mobile

# Add to existing solution
dotnet sln add HotelloSys.Mobile/HotelloSys.Mobile.csproj

# Add required NuGet packages
dotnet add HotelloSys.Mobile package Microsoft.Extensions.Http.Polly
dotnet add HotelloSys.Mobile package Refit
dotnet add HotelloSys.Mobile package SQLite-net-pcl
dotnet add HotelloSys.Mobile package CommunityToolkit.Mvvm
dotnet add HotelloSys.Mobile package CommunityToolkit.Diagnostics
```

**2. Project Structure**

```
HotelloSys.Mobile/
├── Platforms/
│   ├── Android/
│   │   ├── Manifest.xml
│   │   ├── AndroidManifest.xml
│   │   └── Resources/
│   ├── iOS/
│   │   ├── Info.plist
│   │   └── Entitlements.plist
│   ├── MacCatalyst/
│   └── Windows/
├── Resources/
│   ├── Fonts/
│   ├── Colors/
│   ├── Images/
│   └── Styles/
├── Models/
│   ├── Hotel.cs
│   ├── Room.cs
│   ├── Reservation.cs
│   ├── Customer.cs
│   ├── LoyaltyAccount.cs
│   └── Payment.cs
├── Services/
│   ├── IHotelService.cs
│   ├── HotelService.cs
│   ├── IRoomService.cs
│   ├── RoomService.cs
│   ├── IReservationService.cs
│   ├── ReservationService.cs
│   ├── IPaymentService.cs
│   ├── PaymentService.cs
│   ├── ILoyaltyService.cs
│   ├── LoyaltyService.cs
│   ├── ISyncService.cs
│   ├── SyncService.cs
│   └── INotificationService.cs
├── ViewModels/
│   ├── BaseViewModel.cs
│   ├── HotelListViewModel.cs
│   ├── RoomDetailsViewModel.cs
│   ├── ReservationViewModel.cs
│   ├── CheckoutViewModel.cs
│   ├── RoomHoldTimerViewModel.cs
│   ├── LoyaltyViewModel.cs
│   ├── ProfileViewModel.cs
│   └── SearchViewModel.cs
├── Views/
│   ├── HotelListPage.xaml
│   ├── RoomDetailsPage.xaml
│   ├── ReservationPage.xaml
│   ├── CheckoutPage.xaml
│   ├── RoomHoldTimerPage.xaml
│   ├── LoyaltyPage.xaml
│   ├── ProfilePage.xaml
│   └── SearchPage.xaml
├── MauiProgram.cs
├── App.xaml
└── App.xaml.cs
```

**3. MauiProgram.cs Configuration**

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Register Services
        builder.Services.AddScoped<IHotelService, HotelService>();
        builder.Services.AddScoped<IRoomService, RoomService>();
        builder.Services.AddScoped<IReservationService, ReservationService>();
        builder.Services.AddScoped<IPaymentService, PaymentService>();
        builder.Services.AddScoped<ILoyaltyService, LoyaltyService>();
        builder.Services.AddScoped<ISyncService, SyncService>();
        builder.Services.AddScoped<INotificationService, NotificationService>();

        // Register ViewModels
        builder.Services.AddSingleton<HotelListPage>();
        builder.Services.AddSingleton<HotelListViewModel>();
        builder.Services.AddSingleton<RoomDetailsPage>();
        builder.Services.AddSingleton<RoomDetailsViewModel>();
        builder.Services.AddSingleton<ReservationPage>();
        builder.Services.AddSingleton<ReservationViewModel>();
        builder.Services.AddSingleton<CheckoutPage>();
        builder.Services.AddSingleton<CheckoutViewModel>();

        // HTTP Client Configuration
        builder.Services.AddHttpClient<IHotelService, HotelService>(client =>
        {
            client.BaseAddress = new Uri("https://api.hotello.local");
            client.DefaultRequestHeaders.Add("User-Agent", "HotelloSysMobile");
        })
        .AddPolicyHandler(GetRetryPolicy())
        .AddPolicyHandler(GetCircuitBreakerPolicy());

        // SQLite Local Database
        string dbPath = Path.Combine(FileSystem.AppDataDirectory, "hotello.db");
        builder.Services.AddScoped<SQLiteAsyncConnection>(_ =>
            new SQLiteAsyncConnection(dbPath));

        return builder.Build();
    }

    // Polly Retry Policy
    static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(r => r.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            .WaitAndRetryAsync(retryCount: 3,
                sleepDurationProvider: retryAttempt =>
                    TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
    }

    // Polly Circuit Breaker Policy
    static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .CircuitBreakerAsync<HttpResponseMessage>(
                handledEventsAllowedBeforeBreaking: 5,
                durationOfBreak: TimeSpan.FromSeconds(30));
    }
}
```

**4. App Shell Navigation Structure**

```xaml
<!-- AppShell.xaml -->
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       x:Class="HotelloSys.Mobile.AppShell"
       FlyoutBehavior="Flyout">

    <TabBar>
        <ShellContent Title="Hotels" Icon="hotel.png" Route="hotels"
                     ContentTemplate="{DataTemplate local:HotelListPage}" />
        <ShellContent Title="Search" Icon="search.png" Route="search"
                     ContentTemplate="{DataTemplate local:SearchPage}" />
        <ShellContent Title="Loyalty" Icon="loyalty.png" Route="loyalty"
                     ContentTemplate="{DataTemplate local:LoyaltyPage}" />
        <ShellContent Title="Profile" Icon="profile.png" Route="profile"
                     ContentTemplate="{DataTemplate local:ProfilePage}" />
    </TabBar>
</Shell>
```

**5. Deliverables**
- ✅ MAUI project created with 5 target platforms
- ✅ Project structure organized and documented
- ✅ All services registered in DI container
- ✅ Navigation shell configured
- ✅ HTTP client with resilience policies
- ✅ SQLite database setup
- ✅ Build pipeline tested (all platforms compile)

---

### **Week 2: Core Models & Data Access Layer (24-25 hours)**

**Objective**: Define data models and implement local SQLite database

#### Tasks:

**1. Domain Models**

```csharp
// Models/Hotel.cs
public class Hotel
{
    public int HotelID { get; set; }
    public string HotelName { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string PostalCode { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string WebSite { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public string ImageUrl { get; set; }
    public List<string> Amenities { get; set; } = new();
    public List<Room> Rooms { get; set; } = new();
    public SyncStatus SyncStatus { get; set; }
    public DateTime LastSyncDate { get; set; }
}

// Models/Room.cs
public class Room
{
    public int RoomID { get; set; }
    public int HotelID { get; set; }
    public string RoomNumber { get; set; }
    public RoomType RoomType { get; set; }
    public decimal PricePerNight { get; set; }
    public int MaxOccupants { get; set; }
    public bool HasBathroom { get; set; }
    public bool HasBalcony { get; set; }
    public bool HasTV { get; set; }
    public bool HasWifi { get; set; }
    public bool HasAC { get; set; }
    public List<string> Photos { get; set; } = new();
    public string Description { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime AvailableFrom { get; set; }
    public DateTime LastUpdated { get; set; }
}

// Models/Reservation.cs
public class Reservation
{
    public int ReservationID { get; set; }
    public int CustomerID { get; set; }
    public int HotelID { get; set; }
    public int RoomID { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int NumberOfGuests { get; set; }
    public decimal TotalPrice { get; set; }
    public ReservationStatus Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public string SpecialRequests { get; set; }
    public ReservationDownPayment DownPayment { get; set; }
}

// Models/Customer.cs
public class Customer
{
    public int CustomerID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string PostalCode { get; set; }
    public string ProfileImageUrl { get; set; }
    public DateTime RegistrationDate { get; set; }
    public List<Reservation> Reservations { get; set; } = new();
    public List<LoyaltyAccount> LoyaltyAccounts { get; set; } = new();
}

// Models/LoyaltyAccount.cs
public class LoyaltyAccount
{
    public int LoyaltyAccountID { get; set; }
    public int CustomerID { get; set; }
    public int HotelID { get; set; }
    public decimal Points { get; set; }
    public LoyaltyTier Tier { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public DateTime LastPointsEarned { get; set; }
    public string MemberNumber { get; set; }
}

// Models/ReservationDownPayment.cs
public class ReservationDownPayment
{
    public int PaymentID { get; set; }
    public int ReservationID { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public DateTime PaymentDate { get; set; }
    public string TransactionID { get; set; }
    public string ReceiptUrl { get; set; }
}

// Models/Sync Models
public enum ReservationStatus { Pending, Confirmed, Checked, Cancelled }
public enum PaymentStatus { Pending, Completed, Failed, Refunded }
public enum PaymentMethod { CreditCard, DebitCard, PayPal, ApplePay, GooglePay }
public enum LoyaltyTier { Bronze, Silver, Gold, Platinum }
public enum RoomType { Single, Double, Deluxe, Suite, Presidential }
public enum SyncStatus { Synced, Pending, Failed }
```

**2. SQLite Database Repository**

```csharp
// Services/LocalRepository.cs
public class LocalRepository
{
    private readonly SQLiteAsyncConnection _database;

    public LocalRepository()
    {
        string dbPath = Path.Combine(FileSystem.AppDataDirectory, "hotello.db");
        _database = new SQLiteAsyncConnection(dbPath);
    }

    public async Task InitializeAsync()
    {
        await _database.CreateTableAsync<Hotel>();
        await _database.CreateTableAsync<Room>();
        await _database.CreateTableAsync<Reservation>();
        await _database.CreateTableAsync<Customer>();
        await _database.CreateTableAsync<LoyaltyAccount>();
        await _database.CreateTableAsync<ReservationDownPayment>();
    }

    // Hotel operations
    public async Task<List<Hotel>> GetAllHotelsAsync()
        => await _database.Table<Hotel>().ToListAsync();

    public async Task<Hotel> GetHotelAsync(int hotelId)
        => await _database.Table<Hotel>()
            .Where(h => h.HotelID == hotelId)
            .FirstOrDefaultAsync();

    public async Task<int> SaveHotelAsync(Hotel hotel)
    {
        if (hotel.HotelID != 0)
            return await _database.UpdateAsync(hotel);
        return await _database.InsertAsync(hotel);
    }

    // Room operations
    public async Task<List<Room>> GetRoomsByHotelAsync(int hotelId)
        => await _database.Table<Room>()
            .Where(r => r.HotelID == hotelId && r.IsAvailable)
            .ToListAsync();

    public async Task<Room> GetRoomAsync(int roomId)
        => await _database.Table<Room>()
            .Where(r => r.RoomID == roomId)
            .FirstOrDefaultAsync();

    public async Task<int> SaveRoomAsync(Room room)
    {
        if (room.RoomID != 0)
            return await _database.UpdateAsync(room);
        return await _database.InsertAsync(room);
    }

    // Reservation operations
    public async Task<List<Reservation>> GetCustomerReservationsAsync(int customerId)
        => await _database.Table<Reservation>()
            .Where(r => r.CustomerID == customerId)
            .OrderByDescending(r => r.CreatedDate)
            .ToListAsync();

    public async Task<int> SaveReservationAsync(Reservation reservation)
    {
        if (reservation.ReservationID != 0)
            return await _database.UpdateAsync(reservation);
        return await _database.InsertAsync(reservation);
    }

    // Loyalty operations
    public async Task<List<LoyaltyAccount>> GetCustomerLoyaltyAsync(int customerId)
        => await _database.Table<LoyaltyAccount>()
            .Where(l => l.CustomerID == customerId)
            .ToListAsync();
}
```

**3. Deliverables**
- ✅ 6 core domain models defined
- ✅ SQLite schema created and initialized
- ✅ Local repository with CRUD operations
- ✅ Async data access patterns implemented
- ✅ Database initialization on app startup

---

### **Week 3: Hotel Discovery & Search Features (24-25 hours)**

**Objective**: Implement hotel listing, filtering, and search functionality

#### Tasks:

**1. Hotel API Service**

```csharp
// Services/IHotelService.cs
public interface IHotelService
{
    Task<List<Hotel>> GetAllHotelsAsync();
    Task<Hotel> GetHotelDetailsAsync(int hotelId);
    Task<List<Hotel>> SearchHotelsAsync(string city, DateTime checkIn, DateTime checkOut, int guests);
    Task<List<Hotel>> GetNearbyHotelsAsync(double latitude, double longitude, double radiusKm);
    Task<bool> SyncHotelsAsync();
}

// Services/HotelService.cs
public class HotelService : IHotelService
{
    private readonly HttpClient _httpClient;
    private readonly LocalRepository _localRepository;
    private readonly IConnectivity _connectivity;

    public HotelService(HttpClient httpClient, IConnectivity connectivity)
    {
        _httpClient = httpClient;
        _connectivity = connectivity;
    }

    public async Task<List<Hotel>> GetAllHotelsAsync()
    {
        try
        {
            if (_connectivity.NetworkAccess == NetworkAccess.Internet)
            {
                var response = await _httpClient.GetAsync("/api/hotels");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var hotels = JsonSerializer.Deserialize<List<Hotel>>(json);
                    
                    // Cache locally
                    foreach (var hotel in hotels)
                        await _localRepository.SaveHotelAsync(hotel);
                    
                    return hotels;
                }
            }
        }
        catch (HttpRequestException ex)
        {
            Debug.WriteLine($"Error fetching hotels: {ex.Message}");
        }

        // Return cached data
        return await _localRepository.GetAllHotelsAsync();
    }

    public async Task<List<Hotel>> SearchHotelsAsync(string city, DateTime checkIn, 
        DateTime checkOut, int guests)
    {
        var query = $"/api/hotels/search?city={city}&checkIn={checkIn:yyyy-MM-dd}" +
                    $"&checkOut={checkOut:yyyy-MM-dd}&guests={guests}";
        
        var response = await _httpClient.GetAsync(query);
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<List<Hotel>>(json);
    }

    public async Task<List<Hotel>> GetNearbyHotelsAsync(double latitude, double longitude, 
        double radiusKm)
    {
        var query = $"/api/hotels/nearby?lat={latitude}&lng={longitude}&radius={radiusKm}";
        var response = await _httpClient.GetAsync(query);
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<List<Hotel>>(json);
    }

    public async Task<bool> SyncHotelsAsync()
    {
        try
        {
            var hotels = await GetAllHotelsAsync();
            return hotels.Count > 0;
        }
        catch
        {
            return false;
        }
    }
}
```

**2. Hotel List ViewModel & View**

```csharp
// ViewModels/HotelListViewModel.cs
public partial class HotelListViewModel : BaseViewModel
{
    private readonly IHotelService _hotelService;
    
    [ObservableProperty]
    ObservableCollection<Hotel> hotels;

    [ObservableProperty]
    bool isLoading;

    [ObservableProperty]
    string searchCity;

    [ObservableProperty]
    DateTime checkInDate = DateTime.Now.AddDays(1);

    [ObservableProperty]
    DateTime checkOutDate = DateTime.Now.AddDays(3);

    public HotelListViewModel(IHotelService hotelService)
    {
        _hotelService = hotelService;
        Title = "Find Hotels";
    }

    [RelayCommand]
    public async Task LoadHotels()
    {
        IsLoading = true;
        try
        {
            var hotelList = await _hotelService.GetAllHotelsAsync();
            Hotels = new ObservableCollection<Hotel>(hotelList);
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", $"Failed to load hotels: {ex.Message}", "OK");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    public async Task SearchHotels()
    {
        if (string.IsNullOrWhiteSpace(SearchCity))
        {
            await Shell.Current.DisplayAlert("Validation", "Please enter a city", "OK");
            return;
        }

        IsLoading = true;
        try
        {
            var results = await _hotelService.SearchHotelsAsync(
                SearchCity, CheckInDate, CheckOutDate, 1);
            Hotels = new ObservableCollection<Hotel>(results);
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    public async Task SelectHotel(Hotel hotel)
    {
        if (hotel == null) return;
        
        await Shell.Current.GoToAsync(
            $"roomdetails?hotelId={hotel.HotelID}");
    }
}
```

```xaml
<!-- Views/HotelListPage.xaml -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="Hotels"
             x:Class="HotelloSys.Mobile.Views.HotelListPage">
    
    <VerticalStackLayout Padding="20" Spacing="10">
        
        <!-- Search Section -->
        <Frame BorderColor="#E0E0E0" CornerRadius="10" Padding="15">
            <VerticalStackLayout Spacing="10">
                <Entry Placeholder="City" 
                       Text="{Binding SearchCity}" />
                
                <HorizontalStackLayout Spacing="10">
                    <DatePicker Date="{Binding CheckInDate}" 
                               Flex="1" />
                    <DatePicker Date="{Binding CheckOutDate}" 
                               Flex="1" />
                </HorizontalStackLayout>
                
                <Button Text="Search" 
                       Command="{Binding SearchHotelsCommand}"
                       BackgroundColor="#2196F3" 
                       TextColor="White" />
            </VerticalStackLayout>
        </Frame>

        <!-- Hotels List -->
        <RefreshView Command="{Binding LoadHotelsCommand}" 
                     IsRefreshing="{Binding IsLoading}">
            <CollectionView ItemsSource="{Binding Hotels}" 
                           SelectionMode="Single"
                           SelectionChangedCommand="{Binding SelectHotelCommand}"
                           SelectionChangedCommandParameter="{Binding SelectedItem, Source={RelativeSource Self}}">
                <CollectionView.ItemTemplate>
                    <DataTemplate>
                        <Frame BorderColor="#E0E0E0" CornerRadius="10" Margin="0,5">
                            <VerticalStackLayout Spacing="8">
                                <Image Source="{Binding ImageUrl}" 
                                      Aspect="AspectFill" 
                                      HeightRequest="150" />
                                
                                <Label Text="{Binding HotelName}" 
                                      FontSize="16" 
                                      FontAttributes="Bold" />
                                
                                <HorizontalStackLayout Spacing="5">
                                    <Label Text="{Binding City}" 
                                          FontSize="12" 
                                          TextColor="Gray" />
                                    <Label Text="{Binding Country}" 
                                          FontSize="12" 
                                          TextColor="Gray" />
                                </HorizontalStackLayout>

                                <HorizontalStackLayout Spacing="5">
                                    <Label Text="⭐" FontSize="12" />
                                    <Label Text="{Binding Rating, StringFormat='{0:F1}'}" 
                                          FontSize="12" />
                                    <Label Text="{Binding ReviewCount, StringFormat='({0} reviews)'}" 
                                          FontSize="10" 
                                          TextColor="Gray" />
                                </HorizontalStackLayout>
                            </VerticalStackLayout>
                        </Frame>
                    </DataTemplate>
                </CollectionView.ItemTemplate>
            </CollectionView>
        </RefreshView>
    </VerticalStackLayout>
</ContentPage>
```

**3. Deliverables**
- ✅ Hotel search service with offline support
- ✅ Hotel list page with RefreshView
- ✅ Search filtering by city and dates
- ✅ Nearby hotels feature (geolocation ready)
- ✅ Caching strategy implemented

---

### **Week 4: Room Details & Availability (24-25 hours)**

**Objective**: Display room details with photos, features, and availability calendar

#### Tasks:

**1. Room Service & ViewModel**

```csharp
// Services/RoomService.cs
public class RoomService : IRoomService
{
    private readonly HttpClient _httpClient;
    private readonly LocalRepository _localRepository;

    public RoomService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<Room>> GetHotelRoomsAsync(int hotelId, DateTime checkIn, DateTime checkOut)
    {
        var query = $"/api/rooms/hotel/{hotelId}?checkIn={checkIn:yyyy-MM-dd}&checkOut={checkOut:yyyy-MM-dd}";
        var response = await _httpClient.GetAsync(query);
        var json = await response.Content.ReadAsStringAsync();
        var rooms = JsonSerializer.Deserialize<List<Room>>(json);
        
        foreach (var room in rooms)
            await _localRepository.SaveRoomAsync(room);
        
        return rooms;
    }

    public async Task<Room> GetRoomDetailsAsync(int roomId)
    {
        var response = await _httpClient.GetAsync($"/api/rooms/{roomId}");
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<Room>(json);
    }
}

// ViewModels/RoomDetailsViewModel.cs
[QueryProperty(nameof(HotelId), "hotelId")]
public partial class RoomDetailsViewModel : BaseViewModel
{
    private readonly IRoomService _roomService;

    [ObservableProperty]
    int hotelId;

    [ObservableProperty]
    ObservableCollection<Room> rooms;

    [ObservableProperty]
    Room selectedRoom;

    [ObservableProperty]
    bool isLoading;

    [ObservableProperty]
    DateTime checkInDate;

    [ObservableProperty]
    DateTime checkOutDate;

    public RoomDetailsViewModel(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [RelayCommand]
    public async Task LoadRooms()
    {
        IsLoading = true;
        try
        {
            var roomList = await _roomService.GetHotelRoomsAsync(HotelId, CheckInDate, CheckOutDate);
            Rooms = new ObservableCollection<Room>(roomList);
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    public async Task ReserveRoom(Room room)
    {
        await Shell.Current.GoToAsync($"reservation?roomId={room.RoomID}&hotelId={HotelId}");
    }
}
```

**2. Room Details View with Carousel**

```xaml
<!-- Views/RoomDetailsPage.xaml -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="Available Rooms"
             x:Class="HotelloSys.Mobile.Views.RoomDetailsPage">
    
    <VerticalStackLayout>
        <RefreshView Command="{Binding LoadRoomsCommand}"
                     IsRefreshing="{Binding IsLoading}">
            <CollectionView ItemsSource="{Binding Rooms}">
                <CollectionView.ItemTemplate>
                    <DataTemplate>
                        <Frame BorderColor="#E0E0E0" CornerRadius="10" Margin="10" Padding="0">
                            <VerticalStackLayout>
                                <!-- Photo Carousel -->
                                <CarouselView ItemsSource="{Binding Photos}"
                                             HeightRequest="200">
                                    <CarouselView.ItemTemplate>
                                        <DataTemplate>
                                            <Image Source="{Binding}" 
                                                  Aspect="AspectFill" />
                                        </DataTemplate>
                                    </CarouselView.ItemTemplate>
                                </CarouselView>

                                <VerticalStackLayout Padding="15" Spacing="10">
                                    <Label Text="{Binding RoomNumber}" 
                                          FontSize="18" 
                                          FontAttributes="Bold" />
                                    
                                    <Label Text="{Binding RoomType}" 
                                          FontSize="14" 
                                          TextColor="Gray" />
                                    
                                    <Label Text="{Binding Description}" 
                                          FontSize="12" 
                                          LineBreakMode="WordWrap" />

                                    <!-- Amenities -->
                                    <FlexLayout Direction="Row" Wrap="Wrap" Spacing="5">
                                        <Label Text="🛏️" 
                                              IsVisible="{Binding HasBathroom}" />
                                        <Label Text="📺" 
                                              IsVisible="{Binding HasTV}" />
                                        <Label Text="📶" 
                                              IsVisible="{Binding HasWifi}" />
                                        <Label Text="❄️" 
                                              IsVisible="{Binding HasAC}" />
                                        <Label Text="🌴" 
                                              IsVisible="{Binding HasBalcony}" />
                                    </FlexLayout>

                                    <!-- Price -->
                                    <Label Text="{Binding PricePerNight, StringFormat='${0:F2}/night'}" 
                                          FontSize="16" 
                                          FontAttributes="Bold" 
                                          TextColor="Green" />

                                    <!-- Book Button -->
                                    <Button Text="Reserve Now" 
                                           Command="{Binding Source={RelativeSource AncestorType={x:Type local:RoomDetailsViewModel}}, Path=ReserveRoomCommand}"
                                           CommandParameter="{Binding .}"
                                           BackgroundColor="#4CAF50"
                                           TextColor="White" />
                                </VerticalStackLayout>
                            </VerticalStackLayout>
                        </Frame>
                    </DataTemplate>
                </CollectionView.ItemTemplate>
            </CollectionView>
        </RefreshView>
    </VerticalStackLayout>
</ContentPage>
```

**3. Deliverables**
- ✅ Room listing by hotel and dates
- ✅ Photo carousel for each room
- ✅ Amenities display with icons
- ✅ Price calculation per night
- ✅ Availability filtering

---

### **Week 5: Reservation & Checkout Workflow (24-25 hours)**

**Objective**: Complete reservation booking with payment integration

#### Tasks:

**1. Reservation Service & Payment Integration**

```csharp
// Services/ReservationService.cs
public class ReservationService : IReservationService
{
    private readonly HttpClient _httpClient;
    private readonly IPaymentService _paymentService;
    private readonly LocalRepository _localRepository;

    public async Task<Reservation> CreateReservationWithDownPaymentAsync(
        int customerId, int roomId, DateTime checkIn, DateTime checkOut, 
        int guests, decimal totalPrice)
    {
        // Create base reservation
        var reservation = new Reservation
        {
            CustomerID = customerId,
            RoomID = roomId,
            CheckInDate = checkIn,
            CheckOutDate = checkOut,
            NumberOfGuests = guests,
            TotalPrice = totalPrice,
            Status = ReservationStatus.Pending,
            CreatedDate = DateTime.Now
        };

        // Calculate down payment (20% of total)
        var downPaymentAmount = totalPrice * 0.20m;

        // Process payment
        var paymentResult = await _paymentService.ProcessPaymentAsync(
            customerId, downPaymentAmount);

        if (paymentResult.IsSuccessful)
        {
            // Save reservation
            var response = await _httpClient.PostAsJsonAsync("/api/reservations", reservation);
            
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var createdReservation = JsonSerializer.Deserialize<Reservation>(json);
                
                // Save down payment record
                createdReservation.DownPayment = new ReservationDownPayment
                {
                    ReservationID = createdReservation.ReservationID,
                    Amount = downPaymentAmount,
                    Status = PaymentStatus.Completed,
                    PaymentMethod = paymentResult.PaymentMethod,
                    PaymentDate = DateTime.Now,
                    TransactionID = paymentResult.TransactionId
                };

                await _localRepository.SaveReservationAsync(createdReservation);
                return createdReservation;
            }
        }

        throw new Exception("Reservation creation failed");
    }
}

// Services/PaymentService.cs
public class PaymentService : IPaymentService
{
    private readonly HttpClient _httpClient;

    public async Task<PaymentResult> ProcessPaymentAsync(int customerId, decimal amount)
    {
        var request = new
        {
            CustomerId = customerId,
            Amount = amount,
            Currency = "USD"
        };

        var response = await _httpClient.PostAsJsonAsync("/api/payments/process", request);
        
        if (response.IsSuccessStatusCode)
        {
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<PaymentResult>(json);
        }

        return new PaymentResult { IsSuccessful = false };
    }
}
```

**2. Checkout ViewModel**

```csharp
// ViewModels/CheckoutViewModel.cs
[QueryProperty(nameof(RoomId), "roomId")]
[QueryProperty(nameof(HotelId), "hotelId")]
public partial class CheckoutViewModel : BaseViewModel
{
    private readonly IReservationService _reservationService;
    private readonly IPaymentService _paymentService;

    [ObservableProperty]
    int roomId, hotelId;

    [ObservableProperty]
    decimal totalPrice;

    [ObservableProperty]
    decimal downPaymentAmount;

    [ObservableProperty]
    string guestName;

    [ObservableProperty]
    string email;

    [ObservableProperty]
    bool isProcessing;

    [RelayCommand]
    public async Task CompleteReservation()
    {
        IsProcessing = true;
        try
        {
            // Get customer ID (from logged-in user)
            var customerId = await SecureStorage.GetAsync("customer_id");

            var reservation = await _reservationService.CreateReservationWithDownPaymentAsync(
                int.Parse(customerId), RoomId, 
                DateTime.Now.AddDays(1), DateTime.Now.AddDays(3), 2, TotalPrice);

            await Shell.Current.DisplayAlert("Success", 
                $"Reservation confirmed! Confirmation: {reservation.ReservationID}", "OK");

            await Shell.Current.GoToAsync("roomholdtimer");
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", $"Booking failed: {ex.Message}", "OK");
        }
        finally
        {
            IsProcessing = false;
        }
    }
}
```

**3. Checkout Page with Payment Methods**

```xaml
<!-- Views/CheckoutPage.xaml -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="Checkout"
             x:Class="HotelloSys.Mobile.Views.CheckoutPage">
    
    <VerticalStackLayout Padding="20" Spacing="15">
        
        <!-- Order Summary -->
        <Frame BorderColor="#E0E0E0" CornerRadius="10" Padding="15">
            <VerticalStackLayout Spacing="10">
                <Label Text="Booking Summary" FontSize="16" FontAttributes="Bold" />
                
                <HorizontalStackLayout>
                    <Label Text="Room Price:" Flex="1" />
                    <Label Text="{Binding TotalPrice, StringFormat='${0:F2}'}" FontAttributes="Bold" />
                </HorizontalStackLayout>

                <HorizontalStackLayout>
                    <Label Text="Down Payment (20%):" Flex="1" />
                    <Label Text="{Binding DownPaymentAmount, StringFormat='${0:F2}'}" 
                          TextColor="Red" FontAttributes="Bold" />
                </HorizontalStackLayout>
            </VerticalStackLayout>
        </Frame>

        <!-- Guest Details -->
        <Frame BorderColor="#E0E0E0" CornerRadius="10" Padding="15">
            <VerticalStackLayout Spacing="10">
                <Label Text="Guest Information" FontSize="14" FontAttributes="Bold" />
                
                <Entry Placeholder="Full Name" 
                       Text="{Binding GuestName}" />
                <Entry Placeholder="Email" 
                       Text="{Binding Email}" 
                       Keyboard="Email" />
            </VerticalStackLayout>
        </Frame>

        <!-- Payment Method Selection -->
        <Frame BorderColor="#E0E0E0" CornerRadius="10" Padding="15">
            <VerticalStackLayout Spacing="10">
                <Label Text="Payment Method" FontSize="14" FontAttributes="Bold" />
                
                <RadioButton Content="Credit Card" Value="CC" />
                <RadioButton Content="Debit Card" Value="DC" />
                <RadioButton Content="Apple Pay" Value="AP" />
                <RadioButton Content="Google Pay" Value="GP" />
            </VerticalStackLayout>
        </Frame>

        <!-- Action Buttons -->
        <Button Text="Complete Booking" 
               Command="{Binding CompleteReservationCommand}"
               BackgroundColor="#4CAF50"
               TextColor="White"
               IsEnabled="{Binding IsProcessing, Converter={StaticResource InvertedBoolConverter}}" />

        <Button Text="Cancel" 
               Padding="15"
               BackgroundColor="Gray"
               TextColor="White" />
    </VerticalStackLayout>
</ContentPage>
```

**4. Deliverables**
- ✅ Complete reservation workflow
- ✅ Down-payment calculation (20%)
- ✅ Payment processing integration
- ✅ Checkout page with order summary
- ✅ Multiple payment method support

---

### **Week 6-7: Room Hold Timer & Notifications (48-50 hours)**

**Objective**: Implement countdown timer for room holds and push notifications

#### Tasks:

**1. Room Hold Timer Service**

```csharp
// Services/RoomHoldTimerService.cs
public class RoomHoldTimerService
{
    private System.Timers.Timer _timer;
    private DateTime _holdExpiryTime;
    private readonly INotificationService _notificationService;

    public event EventHandler<RoomHoldTimerEventArgs> TimerTick;
    public event EventHandler HoldExpired;

    public RoomHoldTimerService(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public void StartHoldTimer(int durationMinutes = 1440) // 24 hours default
    {
        _holdExpiryTime = DateTime.Now.AddMinutes(durationMinutes);
        
        _timer = new System.Timers.Timer(1000); // Update every second
        _timer.Elapsed += (s, e) => UpdateTimer();
        _timer.Start();
    }

    private void UpdateTimer()
    {
        var remaining = _holdExpiryTime - DateTime.Now;

        if (remaining.TotalSeconds <= 0)
        {
            _timer.Stop();
            HoldExpired?.Invoke(this, EventArgs.Empty);
            MainThread.BeginInvokeOnMainThread(() =>
            {
                _notificationService.SendNotificationAsync(
                    "Room Hold Expired", 
                    "Your room reservation hold has expired. Please book again.");
            });
            return;
        }

        TimerTick?.Invoke(this, new RoomHoldTimerEventArgs { TimeRemaining = remaining });

        // Send warning notification at 1 hour remaining
        if (remaining.TotalMinutes == 60)
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                _notificationService.SendNotificationAsync(
                    "Room Hold Expiring Soon", 
                    "Your room reservation hold expires in 1 hour.");
            });
        }
    }

    public TimeSpan GetTimeRemaining() => _holdExpiryTime - DateTime.Now;

    public void CancelHold()
    {
        _timer?.Stop();
    }
}

// Models/RoomHoldTimerEventArgs.cs
public class RoomHoldTimerEventArgs : EventArgs
{
    public TimeSpan TimeRemaining { get; set; }
}
```

**2. Notification Service**

```csharp
// Services/NotificationService.cs
public class NotificationService : INotificationService
{
    public async Task SendNotificationAsync(string title, string message)
    {
        var notification = new NotificationRequest
        {
            Title = title,
            Description = message,
            NotifyTime = DateTime.Now.AddSeconds(5)
        };

        await LocalNotificationCenter.Current.SendAsync(notification);
    }

    public async Task SendBookingConfirmationAsync(Reservation reservation)
    {
        var duration = reservation.CheckOutDate - reservation.CheckInDate;
        var message = $"Your reservation is confirmed. " +
                     $"Check-in: {reservation.CheckInDate:MMM dd}, " +
                     $"Duration: {duration.Days} nights.";

        await SendNotificationAsync("Booking Confirmed!", message);
    }
}
```

**3. Room Hold Timer View & ViewModel**

```csharp
// ViewModels/RoomHoldTimerViewModel.cs
public partial class RoomHoldTimerViewModel : BaseViewModel
{
    private readonly RoomHoldTimerService _timerService;

    [ObservableProperty]
    string timeRemaining = "24:00:00";

    [ObservableProperty]
    decimal progressPercentage = 100;

    [ObservableProperty]
    bool isHoldActive = true;

    public RoomHoldTimerViewModel()
    {
        Title = "Room Reserved";
        _timerService = new RoomHoldTimerService(null);
        _timerService.TimerTick += OnTimerTick;
        _timerService.HoldExpired += OnHoldExpired;
    }

    [RelayCommand]
    public void StartTimer()
    {
        _timerService.StartHoldTimer(1440); // 24 hours
    }

    private void OnTimerTick(object sender, RoomHoldTimerEventArgs e)
    {
        MainThread.BeginInvokeOnMainThread(() =>
        {
            TimeRemaining = e.TimeRemaining.ToString(@"hh\:mm\:ss");
            ProgressPercentage = (e.TimeRemaining.TotalSeconds / 86400) * 100; // 86400 = 24 hours
        });
    }

    private void OnHoldExpired(object sender, EventArgs e)
    {
        MainThread.BeginInvokeOnMainThread(() =>
        {
            IsHoldActive = false;
            TimeRemaining = "00:00:00";
        });
    }

    [RelayCommand]
    public async Task CompleteBooking()
    {
        _timerService.CancelHold();
        await Shell.Current.GoToAsync("//hotels");
    }
}
```

```xaml
<!-- Views/RoomHoldTimerPage.xaml -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="Room Reserved"
             x:Class="HotelloSys.Mobile.Views.RoomHoldTimerPage">
    
    <VerticalStackLayout Padding="20" Spacing="30" VerticalOptions="Center">
        
        <Label Text="✓ Room Reserved!"
              FontSize="32"
              TextColor="Green"
              HorizontalTextAlignment="Center"
              FontAttributes="Bold" />

        <Label Text="Complete your booking before the hold expires"
              FontSize="14"
              TextColor="Gray"
              HorizontalTextAlignment="Center" />

        <!-- Timer Display -->
        <Frame BorderColor="Orange" CornerRadius="20" Padding="30">
            <VerticalStackLayout Spacing="10" HorizontalOptions="Center">
                <Label Text="Time Remaining" 
                      FontSize="14" 
                      TextColor="Gray"
                      HorizontalTextAlignment="Center" />

                <Label Text="{Binding TimeRemaining}" 
                      FontSize="48"
                      FontAttributes="Bold"
                      HorizontalTextAlignment="Center"
                      FontFamily="LargeLabel" />
            </VerticalStackLayout>
        </Frame>

        <!-- Progress Bar -->
        <ProgressBar Value="{Binding ProgressPercentage, StringFormat='{0:F0}'}"
                     Maximum="100"
                     ProgressColor="Orange" />

        <!-- Action Button -->
        <Button Text="Complete Booking"
               Command="{Binding CompleteBookingCommand}"
               BackgroundColor="#4CAF50"
               TextColor="White"
               Padding="15"
               FontSize="14" />
    </VerticalStackLayout>
</ContentPage>
```

**4. Deliverables**
- ✅ Real-time countdown timer
- ✅ Hold expiry notifications
- ✅ Visual progress indicator
- ✅ Warning notifications (1 hour remaining)
- ✅ Automatic hold cancellation on expiry

---

### **Week 8: Loyalty Program Integration (24-25 hours)**

**Objective**: Display loyalty points and tier information per hotel

#### Tasks:

**1. Loyalty Service**

```csharp
// Services/LoyaltyService.cs
public class LoyaltyService : ILoyaltyService
{
    private readonly HttpClient _httpClient;
    private readonly LocalRepository _localRepository;

    public async Task<List<LoyaltyAccount>> GetCustomerLoyaltyAccountsAsync(int customerId)
    {
        var response = await _httpClient.GetAsync($"/api/loyalty/customer/{customerId}");
        var json = await response.Content.ReadAsStringAsync();
        var accounts = JsonSerializer.Deserialize<List<LoyaltyAccount>>(json);
        
        foreach (var account in accounts)
            await _localRepository.SaveLoyaltyAsync(account);
        
        return accounts;
    }

    public async Task<LoyaltyAccount> GetLoyaltyAccountAsync(int accountId)
    {
        var response = await _httpClient.GetAsync($"/api/loyalty/{accountId}");
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<LoyaltyAccount>(json);
    }

    public async Task<bool> RedeemPointsAsync(int accountId, int points)
    {
        var request = new { Points = points };
        var response = await _httpClient.PostAsJsonAsync(
            $"/api/loyalty/{accountId}/redeem", request);
        return response.IsSuccessStatusCode;
    }
}
```

**2. Loyalty ViewModel & View**

```csharp
// ViewModels/LoyaltyViewModel.cs
public partial class LoyaltyViewModel : BaseViewModel
{
    private readonly ILoyaltyService _loyaltyService;

    [ObservableProperty]
    ObservableCollection<LoyaltyAccount> loyaltyAccounts;

    [ObservableProperty]
    bool isLoading;

    [ObservableProperty]
    decimal totalPoints;

    public LoyaltyViewModel(ILoyaltyService loyaltyService)
    {
        _loyaltyService = loyaltyService;
        Title = "Loyalty Points";
    }

    [RelayCommand]
    public async Task LoadLoyaltyAccounts()
    {
        IsLoading = true;
        try
        {
            var customerId = int.Parse(await SecureStorage.GetAsync("customer_id"));
            var accounts = await _loyaltyService.GetCustomerLoyaltyAccountsAsync(customerId);
            LoyaltyAccounts = new ObservableCollection<LoyaltyAccount>(accounts);
            TotalPoints = accounts.Sum(a => a.Points);
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    public async Task RedeemPoints(LoyaltyAccount account)
    {
        var success = await _loyaltyService.RedeemPointsAsync(account.LoyaltyAccountID, 100);
        if (success)
            await Shell.Current.DisplayAlert("Success", "Points redeemed!", "OK");
    }
}
```

```xaml
<!-- Views/LoyaltyPage.xaml -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="Loyalty"
             x:Class="HotelloSys.Mobile.Views.LoyaltyPage">
    
    <VerticalStackLayout Padding="20" Spacing="15">
        
        <!-- Total Points Card -->
        <Frame BorderColor="Gold" CornerRadius="10" Padding="20">
            <VerticalStackLayout Spacing="10">
                <Label Text="Total Points" FontSize="14" TextColor="Gray" />
                <Label Text="{Binding TotalPoints}" FontSize="32" FontAttributes="Bold" TextColor="Gold" />
            </VerticalStackLayout>
        </Frame>

        <!-- Loyalty Accounts by Hotel -->
        <Label Text="Your Loyalty Accounts" FontSize="16" FontAttributes="Bold" />
        
        <CollectionView ItemsSource="{Binding LoyaltyAccounts}">
            <CollectionView.ItemTemplate>
                <DataTemplate>
                    <Frame BorderColor="#E0E0E0" CornerRadius="10" Margin="0,5">
                        <VerticalStackLayout Spacing="10">
                            <Label Text="{Binding HotelName}" FontSize="14" FontAttributes="Bold" />
                            
                            <HorizontalStackLayout>
                                <Label Text="Member Level:" Flex="1" />
                                <Label Text="{Binding Tier}" FontAttributes="Bold" />
                            </HorizontalStackLayout>

                            <HorizontalStackLayout>
                                <Label Text="Points:" Flex="1" />
                                <Label Text="{Binding Points, StringFormat='{0:N0}'}" FontAttributes="Bold" />
                            </HorizontalStackLayout>

                            <Button Text="Redeem Points"
                                   Command="{Binding Source={RelativeSource AncestorType={x:Type local:LoyaltyViewModel}}, Path=RedeemPointsCommand}"
                                   CommandParameter="{Binding .}"
                                   BackgroundColor="#FF9800"
                                   TextColor="White" />
                        </VerticalStackLayout>
                    </Frame>
                </DataTemplate>
            </CollectionView.ItemTemplate>
        </CollectionView>
    </VerticalStackLayout>
</ContentPage>
```

**3. Deliverables**
- ✅ Loyalty points display per hotel
- ✅ Tier information display
- ✅ Point redemption workflow
- ✅ Total points calculation
- ✅ Enrollment date tracking

---

### **Week 9: Customer Profile & Authentication (24-25 hours)**

**Objective**: Customer sign-up, login, and profile management

#### Tasks:

**1. Authentication & Profile Service**

```csharp
// Services/AuthService.cs
public interface IAuthService
{
    Task<bool> RegisterAsync(string email, string password, string firstName, string lastName);
    Task<bool> LoginAsync(string email, string password);
    Task<bool> LogoutAsync();
    Task<Customer> GetCurrentCustomerAsync();
    Task<bool> UpdateProfileAsync(Customer customer);
}

public class AuthService : IAuthService
{
    private readonly HttpClient _httpClient;
    private const string TokenKey = "auth_token";
    private const string CustomerId = "customer_id";

    public async Task<bool> RegisterAsync(string email, string password, 
        string firstName, string lastName)
    {
        var request = new { Email = email, Password = password, FirstName = firstName, LastName = lastName };
        var response = await _httpClient.PostAsJsonAsync("/api/auth/register", request);
        
        if (response.IsSuccessStatusCode)
        {
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<AuthResponse>(json);
            
            await SecureStorage.SetAsync(TokenKey, result.Token);
            await SecureStorage.SetAsync(CustomerId, result.CustomerId.ToString());
            
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", result.Token);
            
            return true;
        }
        return false;
    }

    public async Task<bool> LoginAsync(string email, string password)
    {
        var request = new { Email = email, Password = password };
        var response = await _httpClient.PostAsJsonAsync("/api/auth/login", request);
        
        if (response.IsSuccessStatusCode)
        {
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<AuthResponse>(json);
            
            await SecureStorage.SetAsync(TokenKey, result.Token);
            await SecureStorage.SetAsync(CustomerId, result.CustomerId.ToString());
            
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", result.Token);
            
            return true;
        }
        return false;
    }

    public async Task<bool> LogoutAsync()
    {
        SecureStorage.Remove(TokenKey);
        SecureStorage.Remove(CustomerId);
        _httpClient.DefaultRequestHeaders.Authorization = null;
        return true;
    }

    public async Task<Customer> GetCurrentCustomerAsync()
    {
        var customerId = await SecureStorage.GetAsync(CustomerId);
        var response = await _httpClient.GetAsync($"/api/customers/{customerId}");
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<Customer>(json);
    }

    public async Task<bool> UpdateProfileAsync(Customer customer)
    {
        var response = await _httpClient.PutAsJsonAsync($"/api/customers/{customer.CustomerID}", customer);
        return response.IsSuccessStatusCode;
    }
}
```

**2. Profile Page & ViewModel**

```csharp
// ViewModels/ProfileViewModel.cs
public partial class ProfileViewModel : BaseViewModel
{
    private readonly IAuthService _authService;

    [ObservableProperty]
    Customer currentCustomer;

    [ObservableProperty]
    bool isLoading;

    [ObservableProperty]
    string firstName, lastName, email, phoneNumber;

    public ProfileViewModel(IAuthService authService)
    {
        _authService = authService;
        Title = "Profile";
    }

    [RelayCommand]
    public async Task LoadProfile()
    {
        IsLoading = true;
        try
        {
            CurrentCustomer = await _authService.GetCurrentCustomerAsync();
            FirstName = CurrentCustomer.FirstName;
            LastName = CurrentCustomer.LastName;
            Email = CurrentCustomer.Email;
            PhoneNumber = CurrentCustomer.PhoneNumber;
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    public async Task SaveProfile()
    {
        CurrentCustomer.FirstName = FirstName;
        CurrentCustomer.LastName = LastName;
        CurrentCustomer.PhoneNumber = PhoneNumber;

        var success = await _authService.UpdateProfileAsync(CurrentCustomer);
        if (success)
            await Shell.Current.DisplayAlert("Success", "Profile updated!", "OK");
    }

    [RelayCommand]
    public async Task Logout()
    {
        await _authService.LogoutAsync();
        await Shell.Current.GoToAsync("//login");
    }
}
```

```xaml
<!-- Views/ProfilePage.xaml -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             Title="Profile"
             x:Class="HotelloSys.Mobile.Views.ProfilePage">
    
    <VerticalStackLayout Padding="20" Spacing="15">
        
        <!-- Profile Header -->
        <Frame BorderColor="#E0E0E0" CornerRadius="10" Padding="15">
            <VerticalStackLayout Spacing="10" HorizontalOptions="Center">
                <Image Source="profilepic.png" 
                      WidthRequest="80" 
                      HeightRequest="80" 
                      Aspect="AspectFill"
                      CornerRadius="40" />
                <Label Text="{Binding CurrentCustomer.FirstName, StringFormat='{0} {1}'}" 
                      FontSize="18" 
                      FontAttributes="Bold"
                      HorizontalTextAlignment="Center" />
            </VerticalStackLayout>
        </Frame>

        <!-- Edit Profile Form -->
        <Frame BorderColor="#E0E0E0" CornerRadius="10" Padding="15">
            <VerticalStackLayout Spacing="10">
                <Label Text="Edit Profile" FontSize="14" FontAttributes="Bold" />
                
                <Entry Placeholder="First Name" 
                       Text="{Binding FirstName}" />
                <Entry Placeholder="Last Name" 
                       Text="{Binding LastName}" />
                <Entry Placeholder="Email" 
                       Text="{Binding Email}" 
                       IsReadOnly="True" />
                <Entry Placeholder="Phone" 
                       Text="{Binding PhoneNumber}" 
                       Keyboard="Telephone" />

                <Button Text="Save Changes" 
                       Command="{Binding SaveProfileCommand}"
                       BackgroundColor="#2196F3"
                       TextColor="White" />
            </VerticalStackLayout>
        </Frame>

        <!-- Account Actions -->
        <Button Text="Logout" 
               Command="{Binding LogoutCommand}"
               BackgroundColor="Red"
               TextColor="White" />
    </VerticalStackLayout>
</ContentPage>
```

**3. Deliverables**
- ✅ User registration workflow
- ✅ Secure login with JWT token
- ✅ Profile view and edit
- ✅ Token-based authentication
- ✅ Logout functionality

---

### **Week 10-11: Cross-Hotel Synchronization (48-50 hours)**

**Objective**: Real-time synchronization across multiple hotel properties

#### Tasks:

**1. Sync Service**

```csharp
// Services/SyncService.cs
public class SyncService : ISyncService
{
    private readonly HttpClient _httpClient;
    private readonly LocalRepository _localRepository;
    private System.Timers.Timer _syncTimer;

    public async Task<bool> SyncAllDataAsync()
    {
        try
        {
            // Sync hotels
            await SyncHotelsAsync();
            
            // Sync rooms for each hotel
            var hotels = await _localRepository.GetAllHotelsAsync();
            foreach (var hotel in hotels)
            {
                await SyncRoomsAsync(hotel.HotelID);
            }

            // Sync customer reservations
            await SyncReservationsAsync();

            // Sync loyalty accounts
            await SyncLoyaltyAsync();

            return true;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Sync error: {ex.Message}");
            return false;
        }
    }

    private async Task SyncHotelsAsync()
    {
        var response = await _httpClient.GetAsync("/api/hotels/sync");
        var json = await response.Content.ReadAsStringAsync();
        var hotels = JsonSerializer.Deserialize<List<Hotel>>(json);
        
        foreach (var hotel in hotels)
        {
            hotel.SyncStatus = SyncStatus.Synced;
            hotel.LastSyncDate = DateTime.Now;
            await _localRepository.SaveHotelAsync(hotel);
        }
    }

    private async Task SyncRoomsAsync(int hotelId)
    {
        var response = await _httpClient.GetAsync($"/api/rooms/hotel/{hotelId}/sync");
        var json = await response.Content.ReadAsStringAsync();
        var rooms = JsonSerializer.Deserialize<List<Room>>(json);
        
        foreach (var room in rooms)
        {
            room.LastUpdated = DateTime.Now;
            await _localRepository.SaveRoomAsync(room);
        }
    }

    public void StartAutoSync(int intervalMinutes = 5)
    {
        _syncTimer = new System.Timers.Timer(TimeSpan.FromMinutes(intervalMinutes).TotalMilliseconds);
        _syncTimer.Elapsed += async (s, e) => await SyncAllDataAsync();
        _syncTimer.AutoReset = true;
        _syncTimer.Start();
    }

    public void StopAutoSync()
    {
        _syncTimer?.Stop();
    }
}
```

**2. Deliverables**
- ✅ Real-time data synchronization
- ✅ Multi-hotel data consolidation
- ✅ Automatic background sync
- ✅ Conflict resolution handling
- ✅ Sync status tracking

---

### **Week 12: Push Notifications & Offline Support (24-25 hours)**

**Objective**: Implement push notifications and offline-first architecture

#### Tasks:

**1. Push Notification Service**

```csharp
// Services/PushNotificationService.cs
public class PushNotificationService : IPushNotificationService
{
    public async Task RegisterForPushAsync(string token, int customerId)
    {
        using (var client = new HttpClient())
        {
            var request = new { CustomerId = customerId, DeviceToken = token };
            await client.PostAsJsonAsync("/api/notifications/register", request);
        }
    }

    public async Task SendBookingNotificationAsync(Reservation reservation)
    {
        var notification = new NotificationRequest
        {
            Title = "Booking Confirmed",
            Description = $"Your reservation at {reservation.HotelID} is confirmed",
            NotifyTime = DateTime.Now.AddSeconds(5)
        };

        await LocalNotificationCenter.Current.SendAsync(notification);
    }
}
```

**2. Offline Support with SQLite**

```csharp
// Offline-first data sync
public class OfflineSyncManager
{
    private readonly LocalRepository _localRepository;
    private readonly HttpClient _httpClient;
    private readonly IConnectivity _connectivity;

    public async Task SyncPendingChangesAsync()
    {
        if (_connectivity.NetworkAccess != NetworkAccess.Internet)
            return;

        var pendingReservations = await _localRepository.GetPendingReservationsAsync();
        foreach (var reservation in pendingReservations)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/api/reservations", reservation);
                if (response.IsSuccessStatusCode)
                {
                    reservation.SyncStatus = SyncStatus.Synced;
                    await _localRepository.SaveReservationAsync(reservation);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Offline sync error: {ex.Message}");
            }
        }
    }
}
```

**3. Deliverables**
- ✅ Push notification registration
- ✅ Booking confirmation notifications
- ✅ Offline data queue
- ✅ Automatic sync when online
- ✅ Pending changes tracking

---

### **Week 13: App Store & Play Store Preparation (24-25 hours)**

**Objective**: Prepare app for public distribution

#### Tasks:

**1. iOS App Store Submission**

```bash
# Create provisioning profile
# Update Info.plist with app metadata
# Generate app signing certificate
# Create app in App Store Connect
# Build for distribution
dotnet publish -f net8.0-ios -c Release

# Archive and submit
# Upload to TestFlight for beta testing
# Submit for App Store review
```

**2. Google Play Store Submission**

```bash
# Create key store for signing
dotnet publish -f net8.0-android -c Release

# Generate APK for Play Store
# Create app in Google Play Console
# Upload APK
# Add app description and screenshots
# Submit for review
```

**3. Deliverables**
- ✅ App Store Connect submission
- ✅ Google Play Console submission
- ✅ Privacy policy and terms of service
- ✅ App screenshots and descriptions
- ✅ Beta testing (TestFlight)

---

### **Week 14: Launch & Ongoing Support (24-25 hours)**

**Objective**: Monitor app performance and ensure successful launch

#### Tasks:

**1. App Monitoring**

```csharp
// Analytics & crash reporting
public class AppAnalytics
{
    public static void TrackEvent(string eventName, Dictionary<string, string> properties = null)
    {
        // Send to analytics service (e.g., Firebase, Application Insights)
    }

    public static void LogException(Exception ex)
    {
        // Send error to error tracking service
    }
}
```

**2. Performance Monitoring**

- Monitor app crashes
- Track user engagement
- Measure performance metrics
- Identify and fix bugs
- Plan Version 1.1 features

**3. Deliverables**
- ✅ Analytics dashboard setup
- ✅ Crash reporting integrated
- ✅ Performance metrics tracked
- ✅ User feedback system
- ✅ Version 1.1 roadmap

---

## Daily Task Breakdown Example (Week 1, Days 1-3)

### **Day 1: Project Setup (6 hours)**
- 1 hour: Create MAUI project structure
- 1 hour: Add NuGet packages
- 1 hour: Configure MauiProgram.cs
- 1 hour: Set up AppShell navigation
- 1 hour: Configure HTTP client
- 1 hour: Test compilation on all platforms

### **Day 2: Database Setup (6 hours)**
- 1 hour: Design SQLite schema
- 1 hour: Create model classes
- 1 hour: Implement local repository
- 1 hour: Create database initialization
- 1 hour: Write unit tests
- 1 hour: Test data access layer

### **Day 3: DI Configuration (6 hours)**
- 1 hour: Register services in MauiProgram
- 1 hour: Configure HTTP with Polly
- 1 hour: Set up logging
- 1 hour: Create configuration classes
- 1 hour: Implement error handling
- 1 hour: Create integration tests

---

## Code Quality Checklist

✅ **Best Practices**:
- [ ] MVVM pattern implemented correctly
- [ ] Async/await used throughout
- [ ] Proper error handling with try/catch
- [ ] Null checks on all inputs
- [ ] XML documentation comments
- [ ] Unit tests for services (min 80% coverage)
- [ ] Integration tests for API calls
- [ ] Performance profiling completed
- [ ] Memory leak testing
- [ ] Security review completed

✅ **Testing Requirements**:
- [ ] Unit tests for ViewModels
- [ ] Integration tests for Services
- [ ] UI automation tests
- [ ] Load testing for sync service
- [ ] Offline scenario testing
- [ ] Network failure recovery testing
- [ ] Battery consumption testing
- [ ] Storage usage optimization

---

## Completion Criteria

**Phase 13 is complete when**:
- ✅ iOS app available on App Store
- ✅ Android app available on Google Play
- ✅ 100+ active users downloading
- ✅ Crash-free rate > 99%
- ✅ All core features working
- ✅ Performance metrics acceptable
- ✅ User satisfaction rating > 4.0 stars
- ✅ v1.0 documentation complete

---

## References & Resources

- [Microsoft MAUI Documentation](https://docs.microsoft.com/en-us/dotnet/maui)
- [MVVM Community Toolkit](https://github.com/CommunityToolkit/Maui)
- [SQLite-net Documentation](https://github.com/praeclarum/sqlite-net)
- [Refit - REST API Client](https://github.com/reactiveui/refit)
- [App Store Connect Guidelines](https://developer.apple.com/app-store-connect/)
- [Google Play Console](https://developer.android.com/distribute)

---

## Summary

**Phase 13 delivers a complete, production-ready mobile application for iOS and Android using .NET MAUI. The app enables customers to:**
- Search and discover hotels across properties
- View detailed room information with photos
- Make real-time reservations
- Process down-payments
- Track room holds with countdown timers
- Manage loyalty points per hotel
- Maintain unified customer profile
- Sync data across multiple hotels
- Receive push notifications
- Work offline with automatic sync

**Total Effort**: 336-350 hours  
**Timeline**: 14 weeks (Weeks 53-66)  
**Launch**: After Phase 12 completion  
**Platforms**: iOS 14+ and Android 8.0+

Ready for customer acquisition and market expansion!
