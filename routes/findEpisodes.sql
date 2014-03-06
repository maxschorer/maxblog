SELECT
  *
FROM
(
SELECT
  t.name,
  SUM(episode_words) AS total_words,
  array_to_string(array_agg(episode_words ORDER BY season_num, episode_num), ',') AS words_by_ep
FROM (
SELECT
  c.name,
  s.num AS season_num,
  e.num AS episode_num,
  SUM(CASE WHEN l.num_words IS NULL THEN 0 ELSE l.num_words END) AS episode_words
FROM characters c
  INNER JOIN episodes e ON e.air_date <= CURRENT_DATE
  INNER JOIN seasons s ON e.season_id = s.season_id
  LEFT JOIN scenes sc ON e.episode_id = sc.episode_id
  LEFT JOIN lines l ON sc.scene_id = l.scene_id
    AND c.character_id = l.character_id
GROUP BY c.name, s.num, e.num
ORDER BY s.num, e.num
) t
GROUP BY t.name
ORDER BY SUM(episode_words) DESC
) t2
LIMIT  