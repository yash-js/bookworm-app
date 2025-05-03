import { View, Text, FlatList, Touchable, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import styles from '../../assets/styles/profile.styles'
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { API_URL } from '../../constants/api';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Image } from 'expo-image';

export default function Profile() {
    const { token } = useAuthStore()
    const [books, setBooks] = useState([]);
    const [deletedBookId, setDeletedBookId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter()

    const fetchBooks = async (pageNumber = 1, refresh = false) => {

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/books/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Something went wrong');

            setBooks(data.books || []);

        } catch (error) {
            console.log("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    }

    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(<Ionicons
                key={i}
                name={i <= rating ? 'star' : 'star-outline'}
                size={20}
                color={i <= rating ? '#f4b400' : COLORS.textSecondary}

                style={{ marginRight: 2 }}
            />);
        }
        return stars;
    }

    const deleteBook = async (id) => {
        try {
            setDeletedBookId(id);
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            setBooks(books.filter(book => book._id !== id));
            Alert.alert('Success', 'Book deleted successfully');
        } catch (error) {
            console.log('Error deleting book:', error);
            Alert.alert('Error', 'Failed to delete book');
        } finally {
            setDeletedBookId(null);
        }
    }

    const confirmDelete = (id) => {
        Alert.alert(
            'Delete Book',
            'Are you sure you want to delete this book?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteBook(id),
                },
            ],
            { cancelable: true }
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.bookItem}>
            <Image source={item.image} style={styles.bookImage} />

            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} ellipsizeMode='tail' numberOfLines={1}>{item.title}</Text>
                <View style={styles.ratingContainer}>
                    {renderRatingStars(item.rating)}
                </View>
                <Text style={styles.bookCaption} numberOfLines={2}>
                    {item.caption}
                </Text>
                <Text style={styles.bookDate}>{new Date(item.createdAt).toDateString()}</Text>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
                {deletedBookId === item._id ? (
                    <ActivityIndicator size='small' color={COLORS.primary} />
                ) :
                    <Ionicons name="trash-outline" size={20} color={COLORS.primary} />

                }
            </TouchableOpacity>

        </View>
    )

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchBooks();
        setRefreshing(false);
    }

    useEffect(() => {
        fetchBooks();
    }, [])



    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogoutButton />

            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your Recommendations</Text>
                <Text style={styles.booksCount}>{books.length} </Text>
            </View>
            {
                loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={COLORS.primary} />
                    </View>
                )
                    :
                    < FlatList
                        data={books}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.booksList}
                        refreshControl={<RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />}

                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name='book-outline'
                                    size={60}
                                    color={COLORS.textSecondary}
                                />
                                <Text style={styles.emptyText}>No recommendations yet</Text>
                                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
                                    <Text style={styles.addButtonText}>Add your first book</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
            }

        </View>
    )
}