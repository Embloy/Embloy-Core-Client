// Helper functions to identify the type of input based on the label
export const normalizeLabel = (label) => label.toLowerCase().replace(/\s+/g, "")

export const isNameLabel = (label) => {
  const normalized = normalizeLabel(label)
  return (
    normalized.includes("name") ||
    normalized.includes("full") ||
    normalized.includes("first") ||
    normalized.includes("last") ||
    normalized.includes("middle") ||
    normalized.includes("prefix") ||
    normalized.includes("suffix") ||
    normalized.includes("nickname") ||
    normalized.includes("username") ||
    normalized.includes("display") ||
    normalized.includes("preferred") ||
    normalized.includes("screen")
  )
}

export const isEmailLabel = (label) => normalizeLabel(label).includes("email")

export const isPhoneNumberLabel = (label) =>
  normalizeLabel(label).includes("phonenumber")

export const isUrlLabel = (label) => {
  console.log("The label is: ", label)
  const normalized = normalizeLabel(label)
  return (
    normalized.includes("github") ||
    normalized.includes("portfolio") ||
    normalized.includes("facebook") ||
    normalized.includes("instagram") ||
    normalized.includes("linkedin") ||
    normalized.includes("twitter")
  )
}

// Function to map the normalized label to the User object property
export const getUserPropertyValue = (user, label) => {
  if (isNameLabel(label)) return `${user.first_name} ${user.last_name}`
  if (isEmailLabel(label)) return user.email
  if (isPhoneNumberLabel(label)) return user.phone
  if (isUrlLabel(label)) {
    if (normalizeLabel(label).toLowerCase().includes("linkedin")) {
      return user.linkedin_url || ""
    }
    if (normalizeLabel(label).toLowerCase().includes("facebook")) {
      return user.facebook_url || ""
    }
    if (normalizeLabel(label).toLowerCase().includes("instagram")) {
      return user.instagram_url || ""
    }
    if (normalizeLabel(label).toLowerCase().includes("twitter")) {
      return user.twitter_url || ""
    }
    if (normalizeLabel(label).toLowerCase().includes("github")) {
      return user.github_url || ""
    }
    if (normalizeLabel(label).toLowerCase().includes("portfolio")) {
      return user.portfolio_url || ""
    }
    const key = `${normalizeLabel(label).replace(/url|profile|link/g, "")}_url`
    return user[key] || ""
  }
  return ""
}
