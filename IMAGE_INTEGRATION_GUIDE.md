# Image Integration Guide - Food Waste Network

## 🎨 Image Folders Structure

Your application now has a complete image organization system:

```
frontend/public/images/
├── dashboard/          # Dashboard hero and background images
├── food/              # Food category images (6 SVGs)
├── recipients/        # Organization/recipient logos
└── empty-states/      # Empty state illustrations (3 SVGs)
```

## 📁 Image Files Created

### Food Category Images (`/images/food/`)
These SVG files are displayed on food item cards based on the food category:

| File | Category | Colors | Usage |
|------|----------|--------|-------|
| `vegetables.svg` | Vegetables, Salads, Root Vegetables | Green gradient | Fresh produce |
| `fruits.svg` | Fruits, Berries | Yellow/Orange gradient | Fresh fruits |
| `dairy.svg` | Dairy, Eggs, Yogurt, Milk | Yellow/Blue gradient | Dairy products |
| `bakery.svg` | Bread, Grains, Pastries | Brown gradient | Bakery items |
| `meat.svg` | Meat, Seafood, Poultry | Red gradient | Protein foods |
| `prepared.svg` | Prepared meals, Cooked dishes | Orange/Red gradient | Ready-to-eat foods |

**How it works:**
- When you add a food item with category "vegetables", the `vegetables.svg` image appears
- The FoodItemCard component automatically maps categories to images
- If a custom image URL is provided, it takes priority over the category image

### Empty State Illustrations (`/images/empty-states/`)

| File | Purpose | Message |
|------|---------|---------|
| `no-food.svg` | Shows when no food items available | "No food items yet" |
| `no-recipients.svg` | Shows when no recipients added | "Add Recipients" |
| `no-transactions.svg` | Shows when no transactions yet | "Start Donating" |

## 🖼️ Adding Your Own Custom Images

### Option 1: Replace SVG Files
The SVG files are vector graphics that scale perfectly. You can:
1. Download food images from free sources (Unsplash, Pexels, Pixabay)
2. Save as PNG/JPG to the same folder
3. Update file extensions in code

**Popular free sources:**
- [Unsplash](https://unsplash.com/) - Beautiful food photography
- [Pexels](https://www.pexels.com/) - Free stock photos
- [Pixabay](https://pixabay.com/) - Various food images

### Option 2: Use CDN Links
You can use online image URLs directly. Update FoodItemCard.jsx:
```javascript
const getCategoryImage = (category) => {
  const imageMap = {
    vegetables: 'https://example.com/vegetables.jpg',
    dairy: 'https://example.com/dairy.jpg',
    // ... other categories
  };
  return imageMap[category?.toLowerCase()] || imageMap.default;
};
```

### Option 3: Add Organization Logos
For recipient/organization cards, add images to `/images/recipients/`:
- `ngo-logo.png`
- `shelter-logo.png`
- `organization-name.png`

## 🎯 Updated Components

### 1. **FoodItemCard.jsx**
Now displays:
- ✅ Category-based food images (SVG)
- ✅ Custom user-uploaded images
- ✅ Hover zoom animation
- ✅ Category badge overlay
- ✅ Beautiful card design with shadows

**Features:**
```javascript
// Automatically maps category → image
vegetables → /images/food/vegetables.svg
dairy → /images/food/dairy.svg
// ...and so on
```

### 2. **DashboardHero.jsx** (NEW)
Beautiful hero section with:
- ✅ Gradient background (Blue → Purple → Pink)
- ✅ Pattern overlay and decorative elements
- ✅ 4 impact stat cards with glass-morphism effect
- ✅ Animated background layers
- ✅ Responsive design

### 3. **EmptyState.jsx** (NEW)
Friendly empty state component with:
- ✅ SVG illustrations
- ✅ Descriptive messaging
- ✅ Call-to-action buttons
- ✅ Bounce animation on icons
- ✅ Beautiful gradients

## 📝 Category Mapping (FoodItemCard.jsx)

Current automatic mappings:
```javascript
const getCategoryImage = (category) => {
  const imageMap = {
    // Vegetables group
    vegetables: '/images/food/vegetables.svg',
    salads: '/images/food/vegetables.svg',
    root_vegetables: '/images/food/vegetables.svg',
    
    // Dairy group
    dairy: '/images/food/dairy.svg',
    eggs: '/images/food/dairy.svg',
    cheese: '/images/food/dairy.svg',
    yogurt: '/images/food/dairy.svg',
    beverages: '/images/food/dairy.svg',
    
    // Bakery group
    bakery: '/images/food/bakery.svg',
    grains: '/images/food/bakery.svg',
    frozen_meals: '/images/food/prepared.svg',
    
    // Meat group
    meat: '/images/food/meat.svg',
    seafood: '/images/food/meat.svg',
    
    // Prepared foods
    prepared: '/images/food/prepared.svg',
    
    // Fruits
    fruits: '/images/food/fruits.svg',
    
    default: '/images/food/vegetables.svg'
  };
  return imageMap[category?.toLowerCase()] || imageMap.default;
};
```

## 🚀 Adding More Images

### Add Dashboard Banner Image
1. Save banner to `/images/dashboard/banner.jpg`
2. Update DashboardHero.jsx:
```jsx
<div className="absolute inset-0 bg-cover opacity-20" 
     style={{backgroundImage: 'url(/images/dashboard/banner.jpg)'}}></div>
```

### Add Recipient Organization Images
1. Create recipient-specific folder: `/images/recipients/{org-name}/`
2. Add logo and banner images
3. Update recipient display to show image:
```jsx
<img 
  src={`/images/recipients/${recipient.name.toLowerCase()}/logo.png`}
  alt={recipient.name}
  className="w-16 h-16 rounded-lg object-cover"
/>
```

### Add Food Provider Logos
1. Save to `/images/food/providers/{provider-name}.png`
2. Display near provider name in FoodItemCard

## 🎨 Image Best Practices

### Dimensions Recommended
- Food cards: 400×300px or square (1:1)
- Organization logos: 200×200px (square)
- Dashboard banner: 1920×600px
- Empty state illustrations: 300×300px
- Hero images: 1920×1080px

### File Formats
- **SVGs (vectors)**: Perfect for icons and illustrations (scalable)
- **PNG**: Best for transparent images and logos
- **JPG**: Best for photographs (smaller file size)
- **WebP**: Modern format (faster loading)

### File Sizes
- Keep images < 500KB each
- Optimize with tools like TinyPNG, ImageOptim
- Use CDN for faster delivery

### Optimization Tips
```bash
# For PNG files
optipng -o2 image.png

# For JPG files
jpegoptim -m 85 image.jpg

# Using ImageMagick
convert input.jpg -quality 85 -resize 800x output.jpg
```

## 🔗 Image CDN Setup (Optional)

If you want to use a CDN for images:

1. **Cloudinary (Free tier available)**
   - Sign up: https://cloudinary.com
   - Upload images to cloud
   - Get URLs like: `https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/food/vegetables.jpg`

2. **Firebase Storage**
   - Store images in Firebase
   - Get signed URLs automatically

3. **AWS S3**
   - Store in S3 bucket
   - CloudFront for CDN delivery

## 📊 Image Usage Statistics

Current implementation covers:
- ✅ 6 food category images (vectors)
- ✅ 3 empty state illustrations (vectors)
- ✅ 1 hero component with gradients
- ✅ Support for custom images
- ✅ Automatic category matching
- ✅ Responsive design for all devices

## 🎯 Next Steps

1. **Replace SVGs** with your own food images (optional)
2. **Add organization logos** to recipients display
3. **Upload dashboard banner** image
4. **Create provider logos** for food providers
5. **Add recipe/serving photos** for prepared foods
6. **Optimize all images** before deployment

## 📚 Related Files

- [FoodItemCard.jsx](../frontend/src/components/FoodItemCard.jsx) - Food display component
- [DashboardHero.jsx](../frontend/src/components/DashboardHero.jsx) - Hero section
- [EmptyState.jsx](../frontend/src/components/EmptyState.jsx) - Empty states
- [App.jsx](../frontend/src/App.jsx) - Main component using images

## ✨ Visual Enhancements Made

1. **Hero Section** - Gradient with pattern overlay
2. **Food Cards** - Image headers with zoom effect
3. **Empty States** - Illustrated cards with CTAs
4. **Category Icons** - Replaced with full SVG illustrations
5. **Responsive Images** - Work on mobile, tablet, desktop
6. **Glass-morphism Effects** - Modern translucent cards
7. **Smooth Animations** - Hover transitions and bounces

---

**Last Updated**: February 2026
**Status**: Production Ready
**Mobile Responsive**: ✅ Yes
**SVG Support**: ✅ Yes
**Custom Images**: ✅ Yes
