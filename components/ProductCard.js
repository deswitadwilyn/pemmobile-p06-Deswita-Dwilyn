import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const formatPrice = (price) =>
  'Rp ' + price.toLocaleString('id-ID');

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const decimal = rating - full;
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[styles.star, { opacity: i <= full ? 1 : decimal > 0 && i === full + 1 ? 0.5 : 0.2 }]}>
          ★
        </Text>
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const ProductCard = ({ item, isGrid = false, onPress }) => {
  if (isGrid) {
    return (
      <TouchableOpacity style={styles.gridCard} onPress={() => onPress && onPress(item)} activeOpacity={0.85}>
        <View style={styles.gridImageBox}>
          <Text style={styles.gridEmoji}>{item.image}</Text>
        </View>
        <View style={styles.gridInfo}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
          <StarRating rating={item.rating} />
          <Text style={styles.gridPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.soldText}>{item.sold.toLocaleString('id-ID')} terjual</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.listCard} onPress={() => onPress && onPress(item)} activeOpacity={0.85}>
      <View style={styles.listImageBox}>
        <Text style={styles.listEmoji}>{item.image}</Text>
      </View>
      <View style={styles.listInfo}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.listName} numberOfLines={2}>{item.name}</Text>
        <StarRating rating={item.rating} />
        <View style={styles.listBottom}>
          <Text style={styles.listPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.soldText}>{item.sold.toLocaleString('id-ID')} terjual</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // LIST CARD
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F4FF',
  },
  listImageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  listEmoji: {
    fontSize: 36,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D1B4B',
    marginBottom: 4,
    lineHeight: 20,
  },
  listBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  listPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A84FF',
  },

  // GRID CARD
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 6,
    padding: 12,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F4FF',
  },
  gridImageBox: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridEmoji: {
    fontSize: 44,
  },
  gridInfo: {
    flex: 1,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D1B4B',
    marginBottom: 4,
    lineHeight: 18,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A84FF',
    marginTop: 4,
  },

  // SHARED
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF4FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0A84FF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  star: {
    fontSize: 12,
    color: '#FFB800',
    marginRight: 1,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666E8A',
    marginLeft: 4,
  },
  soldText: {
    fontSize: 11,
    color: '#8E94A8',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default ProductCard;
