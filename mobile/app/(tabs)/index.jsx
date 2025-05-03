import { View, Text, FlatList, ActivityIndicator, RefreshControl, } from 'react-native'
import { useAuthStore } from '../../store/authStore'
import { useEffect, useState } from 'react';
import styles from '../../assets/styles/home.styles'
import { API_URL } from '../../constants/api';
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { formatDate, sharedOn } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function Home() {

  const { token } = useAuthStore()

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const toggleCaption = (id) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchBooks = async (pageNumber = 1, refresh = false) => {

    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      } else if (pageNumber == 1) setLoading(true);

      const response = await fetch(`${API_URL}/books?page=${pageNumber}&limit=3`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong');


      const mergedBooks = refresh || pageNumber === 1
        ? data.books
        : [...books, ...data.books];

      const uniqueBooksMap = new Map();

      mergedBooks.forEach(book => {
        uniqueBooksMap.set(book._id, book);
      });

      setBooks(Array.from(uniqueBooksMap.values()));

      setHasMore(pageNumber < data.totalPages);
      setPage(pageNumber)
    } catch (error) {
      console.log("Error fetching books:", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  }

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      fetchBooks(page + 1);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item?.user?.profileImage }} style={styles.avatar} contentFit='cover' />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={item.image}
          style={[styles.bookImage, { backgroundColor: '#f2f2f2', borderWidth: 1, borderColor: COLORS.border }]}
          contentFit='cover'
        />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        {(() => {
          const isExpanded = expandedCaptions[item._id];
          const isLong = item.caption.length > 150;
          const displayedText = isExpanded || !isLong ? item.caption : item.caption.slice(0, 150);

          return (
            <>
              <Text style={styles.caption}>
                {displayedText}
                {(!isExpanded && isLong) ? '...' : ''}
              </Text>
              {isLong && (
                <Text
                  style={[styles.showMoreText, { color: COLORS.primary, marginLeft: 'auto' }]}
                  onPress={() => toggleCaption(item._id)}
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </Text>
              )}
            </>
          );
        })()}

        <Text style={styles.date}>Shared {sharedOn(item.createdAt)}</Text>
      </View>


    </View>
  )

  const renderRatingStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
        />
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>
  }



  useEffect(() => {
    fetchBooks();
  }, []);

  const header = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>BookWorm🐛</Text>
      <Text style={styles.headerSubtitle}>Share your favorite reads</Text>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        {header()}
        <Loader />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        ListHeaderComponent={header}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name='book-outline'
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No book recommendations yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a book!</Text>
          </View>
        }

        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size='small' color={COLORS.primary} />
            </View>
          ) : null
        }

      />


    </View>
  )
}