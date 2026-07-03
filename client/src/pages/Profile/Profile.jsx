import React, { useEffect, useState } from 'react'
import Nav from '../../components/Navbar/Nav'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [skillName, setSkillName] = useState('')
  const [skillRating, setSkillRating] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    githubProfile: '',
    skills: [],
  })

  const getProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/auth/me')
      setProfile(response.data.data)
      setLoading(false)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Profile fetching failed')
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const startEditing = () => {
    setFormData({
      username: profile.username || '',
      bio: profile.bio || '',
      githubProfile: profile.githubProfile || '',
      skills: profile.skills || [],
    })
    setIsEditing(true)
  }

  const addData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddSkill = () => {
    if (!skillName.trim()) return
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: skillName.trim(), rating: Number(skillRating) || 0 }],
    }))
    setSkillName('')
    setSkillRating('')
  }

  const handleRemoveSkill = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== indexToRemove),
    }))
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put('/api/auth/update-profile', formData)
      setProfile(response.data.data)
      setIsEditing(false)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Profile update failed')
    }
  }

  return (
    <>
      <Nav />
      {loading ? (
        <p>Loading Profile</p>
      ) : error ? (
        <p>{error}</p>
      ) : isEditing ? (
        <form onSubmit={updateProfile} style={{ border: '2px solid black', padding: '10px' }}>
          <label>Name:</label>
          <input type="text" name="username" value={formData.username} onChange={addData} />

          <label>Bio:</label>
          <input type="text" name="bio" value={formData.bio} onChange={addData} />

          <label>Github Profile:</label>
          <input type="text" name="githubProfile" value={formData.githubProfile} onChange={addData} />

          <div>
            <label>Skills:</label>
            <input type="text" placeholder="Skill name" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
            <input type="number" placeholder="Rating" value={skillRating} onChange={(e) => setSkillRating(e.target.value)} />
            <button type="button" onClick={handleAddSkill}>Add Skill</button>
            {formData.skills.map((skill, index) => (
              <li key={index}>
                {skill.name} — {skill.rating}
                <button type="button" onClick={() => handleRemoveSkill(index)}>X</button>
              </li>
            ))}
          </div>

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <ul style={{ border: '2px solid black' }}>
            <li>Name: {profile.username}</li>
            <li>Email: {profile.email}</li>
            <li>Bio: {profile.bio}</li>
            <li>Github Profile: {profile.githubProfile}</li>
            <li>
              Skills:
              <ul>
                {profile.skills?.map((skill, index) => (
                  <li key={index}>{skill.name} — {skill.rating}</li>
                ))}
              </ul>
            </li>
          </ul>
          <button onClick={startEditing}>Edit Profile</button>
          <button onClick={() => navigate('/joined-projects')}>See Joined Projects</button>
        </div>
      )}
    </>
  )
}

export default Profile