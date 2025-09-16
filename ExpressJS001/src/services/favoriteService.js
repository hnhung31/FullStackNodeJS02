const Favorite = require('../models/favorite');
const Product = require('../models/product');

const toggleFavoriteService = async (userId, productId) => {
    try {
        const existing = await Favorite.findOne({ user: userId, product: productId });

        if (existing) {
            await Favorite.findByIdAndDelete(existing._id);
            await Product.findByIdAndUpdate(productId, { $pull: { likes: userId } });
            return { EC: 0, EM: "Đã xóa khỏi danh sách yêu thích", data: { isFavorited: false } };
        } else {
            await Favorite.create({ user: userId, product: productId });
            await Product.findByIdAndUpdate(productId, { $addToSet: { likes: userId } });
            return { EC: 0, EM: "Đã thêm vào danh sách yêu thích", data: { isFavorited: true } };
        }
    } catch (error) {
        console.log(error);
        return { EC: -1, EM: "Lỗi server" };
    }
};

const getFavoriteProductsService = async (userId, page, pageSize) => {
    try {
        const skip = (page - 1) * pageSize;
        const totalFavorites = await Favorite.countDocuments({ user: userId });
        const favorites = await Favorite.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate('product');

        const products = favorites.map(fav => fav.product).filter(p => p != null);

        return {
            EC: 0,
            EM: "Lấy danh sách yêu thích thành công",
            data: {
                products,
                pagination: { currentPage: page, totalPages: Math.ceil(totalFavorites / pageSize) }
            }
        };
    } catch (error) {
        console.log(error);
        return { EC: -1, EM: "Lỗi server" };
    }
};

module.exports = { toggleFavoriteService, getFavoriteProductsService };